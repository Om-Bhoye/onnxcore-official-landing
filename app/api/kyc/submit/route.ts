import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import KYCSubmission from '@/lib/models/KYCSubmission';
import User from '@/lib/models/User';
import { getCurrentUser } from '@/lib/auth/rbac';
import { z } from 'zod';

const documentRefSchema = z.object({
    label: z.string(),
    url: z.string().url(),
    storagePath: z.string(),
    mimeType: z.string(),
    sizeBytes: z.number(),
    uploadedAt: z.string().optional().transform(val => val ? new Date(val) : new Date()),
});

const submitKycSchema = z.object({
    kycType: z.enum(['individual', 'corporate']),
    phoneNumber: z.string(),
    phoneVerifiedAt: z.string().transform(val => new Date(val)),
    individualDetails: z.object({
        firstName: z.string(),
        lastName: z.string(),
        contactNumber: z.string(),
        idNumber: z.string(),
        idFrontUrl: z.string().url(),
        idBackUrl: z.string().url(),
        facialVideoUrl: z.string().url(),
    }).optional(),
    corporateDetails: z.object({
        companyName: z.string(),
        contactNumber: z.string(),
        taxIdNumber: z.string(),
        gstCertificateUrl: z.string().url().optional(),
        tradeLicenseUrl: z.string().url().optional(),
        panCardUrl: z.string().url().optional(),
        facialVideoUrl: z.string().url(),
    }).optional(),
    documents: z.array(documentRefSchema),
});

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const parseResult = submitKycSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ error: 'Invalid input', details: parseResult.error.format() }, { status: 400 });
        }

        const data = parseResult.data;

        await dbConnect();

        // One submission per user (upsert logic or block if pending/completed)
        const existing = await KYCSubmission.findOne({ userId: user._id });
        if (existing && existing.status === 'pending') {
            return NextResponse.json({ error: 'KYC submission already pending' }, { status: 409 });
        }

        const submission = await KYCSubmission.findOneAndUpdate(
            { userId: user._id },
            {
                ...data,
                userId: user._id,
                status: 'pending',
                submittedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        // Update User status
        await User.findByIdAndUpdate(user._id, { kycStatus: 'pending' });

        return NextResponse.json({ 
            message: 'KYC submitted successfully',
            submissionId: submission._id 
        }, { status: 201 });

    } catch (error: any) {
        console.error('KYC Submission Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
