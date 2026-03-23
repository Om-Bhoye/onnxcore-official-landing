import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/rbac';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            kycStatus: user.kycStatus,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
