import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/rbac';
import KYCSubmission from '@/lib/models/KYCSubmission';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch latest KYC submission if any
        const kycSubmission = await KYCSubmission.findOne({ userId: user._id });

        // Generate referral code if it doesn't exist
        if (!user.referralCode) {
            const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            user.referralCode = newCode;
            await user.save();
        }

        return NextResponse.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            kycStatus: user.kycStatus,
            profileImage: user.profileImage,
            referralCode: user.referralCode,
            kycDetails: kycSubmission ? {
                status: kycSubmission.status,
                rejectionReason: kycSubmission.rejectionReason,
                submittedAt: kycSubmission.submittedAt,
            } : null
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
