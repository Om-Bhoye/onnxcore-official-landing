import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/rbac';
import User from '@/lib/models/User';

export async function PATCH(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { profileImage, name, email } = body;

        const updateData: any = {};
        if (profileImage !== undefined) updateData.profileImage = profileImage;
        if (name) updateData.name = name;
        // Email update might require verification, but for now we follow simple profile update
        if (email) updateData.email = email;

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profileImage: updatedUser.profileImage,
                role: updatedUser.role,
                kycStatus: updatedUser.kycStatus
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
