import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import KYCSubmission from '@/lib/models/KYCSubmission';
import { getCurrentUser, hasPermission } from '@/lib/auth/rbac';

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user || !hasPermission(user, 'vendor_app.read')) { // Using existing permission or could add kyc.read.any
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const kycType = searchParams.get('kycType');

        await dbConnect();

        const query: any = {};
        if (status) query.status = status;
        if (kycType) query.kycType = kycType;

        const submissions = await KYCSubmission.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        return NextResponse.json(submissions);
    } catch (error) {
        console.error('KYC List Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
