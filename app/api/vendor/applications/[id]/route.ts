import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import VendorApplication from '@/lib/models/VendorApplication';
import { getCurrentUser, canApproveRoles } from '@/lib/auth/rbac';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || !canApproveRoles(currentUser)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const { action } = await req.json();

        if (!['approve', 'reject'].includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        await dbConnect();

        const application = await VendorApplication.findById(id);
        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        application.status = action === 'approve' ? 'approved' : 'rejected';
        application.reviewedBy = currentUser._id as any;
        application.reviewedAt = new Date();
        await application.save();

        return NextResponse.json({ message: `Application ${action}d` }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
