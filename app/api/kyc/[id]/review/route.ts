import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import KYCSubmission from '@/lib/models/KYCSubmission';
import User from '@/lib/models/User';
import { getCurrentUser, hasPermission } from '@/lib/auth/rbac';
import { z } from 'zod';

const reviewSchema = z.object({
    status: z.enum(['approved', 'rejected']),
    rejectionReason: z.string().optional(),
});

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasPermission(user, 'vendor_app.approve')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const parseResult = reviewSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { status, rejectionReason } = parseResult.data;

        await dbConnect();

        const submission = await KYCSubmission.findById(id);
        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        submission.status = status;
        submission.reviewedBy = user._id;
        submission.reviewedAt = new Date();
        if (status === 'rejected') {
            submission.rejectionReason = rejectionReason || 'Information provided is insufficient or invalid.';
        }
        await submission.save();

        // Update User kycStatus
        const userKycStatus = status === 'approved' ? 'completed' : 'not_started';
        await User.findByIdAndUpdate(submission.userId, { kycStatus: userKycStatus });

        return NextResponse.json({ 
            message: `KYC ${status} successfully`,
            status 
        });

    } catch (error) {
        console.error('KYC Review Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
