import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import VendorApplication from '@/lib/models/VendorApplication';
import { getCurrentUser, canApproveRoles } from '@/lib/auth/rbac';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || !canApproveRoles(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        const applications = await VendorApplication.find({ status: 'pending' }).sort({ createdAt: -1 });
        return NextResponse.json({ applications }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
