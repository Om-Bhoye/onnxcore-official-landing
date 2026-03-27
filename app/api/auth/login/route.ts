import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/AuthService';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // Authenticate the user and create a session via the Proxy service
        const { accessToken, refreshToken, user } = await AuthService.authenticateUser(
            email,
            password,
            req.headers.get('user-agent') || 'Unknown',
            req.headers.get('x-forwarded-for') || 'Unknown'
        );

        // Set auth cookies
        await AuthService.setAuthCookies(accessToken, refreshToken);

        return NextResponse.json({ 
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error('Login error:', error.message);
        
        if (error.message === 'Invalid credentials') {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (error.message.includes('suspented')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }
        
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
