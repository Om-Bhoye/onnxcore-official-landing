import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { getCurrentUser } from '@/lib/auth/rbac';

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { idNumber, fullLegalName } = await req.json();

        if (!idNumber || !fullLegalName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        await User.findByIdAndUpdate(user._id, {
            kycStatus: 'pending',
            // In a real app, we'd store these details in a KYC sub-document or separate collection
        });

        return NextResponse.json({ message: 'KYC submitted successfully' }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
