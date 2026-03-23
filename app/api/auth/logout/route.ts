import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Session from '@/lib/models/Session';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;

        if (refreshToken) {
            await dbConnect();
            const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
            await Session.deleteOne({ refreshTokenHash });
        }

        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');

        return NextResponse.json({ message: 'Logged out' });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
