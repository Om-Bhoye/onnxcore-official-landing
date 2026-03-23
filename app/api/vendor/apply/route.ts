import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import VendorApplication from '@/lib/models/VendorApplication';
import { z } from 'zod';

const applicationSchema = z.object({
    companyName: z.string().min(2),
    companyBrandName: z.string().min(2),
    officialWebsite: z.string().url().or(z.string().min(3)),
    companyAddress: z.string().min(5),
    contactPerson: z.string().min(2),
    email: z.string().email(),
    businessType: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parseResult = applicationSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: parseResult.error.issues },
                { status: 400 }
            );
        }

        const { 
            companyName, 
            companyBrandName, 
            officialWebsite, 
            companyAddress, 
            contactPerson, 
            email, 
            businessType 
        } = parseResult.data;

        await dbConnect();

        // Check if application already exists for this email
        const existingApp = await VendorApplication.findOne({ email: email.toLowerCase() });
        if (existingApp) {
            return NextResponse.json(
                { error: 'An application with this email already exists' },
                { status: 409 }
            );
        }

        await VendorApplication.create({
            companyName,
            companyBrandName,
            officialWebsite,
            companyAddress,
            contactPerson,
            email: email.toLowerCase(),
            businessType: businessType || '',
        });

        return NextResponse.json(
            { message: 'Application submitted successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Vendor Apply Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
