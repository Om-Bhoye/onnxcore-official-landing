import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import Session from '@/lib/models/Session';
import { verifyPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/tokens';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        await dbConnect();

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await verifyPassword(password, user.passwordHash))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const accessToken = await generateAccessToken({ userId: user._id.toString() });
        const refreshToken = await generateRefreshToken({ userId: user._id.toString() });

        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await Session.create({
            userId: user._id,
            refreshTokenHash,
            device: req.headers.get('user-agent') || 'Unknown',
            ipAddress: req.headers.get('x-forwarded-for') || 'Unknown',
            expiresAt,
        });

        const cookieStore = await cookies();
        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60,
        });

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
        });

        return NextResponse.json({ message: 'Login successful' });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
