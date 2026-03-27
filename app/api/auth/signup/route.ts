import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { z } from 'zod';

const signupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.string(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parseResult = signupSchema.safeParse(body);

        if (!parseResult.success) {
            console.error('Signup validation error:', parseResult.error.issues);
            return NextResponse.json({ error: 'Invalid input', details: parseResult.error.issues }, { status: 400 });
        }

        const { name, email, password, role } = parseResult.data;

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // VENDOR RESTRICTION: Removed as per request to allow direct signup for all roles
        
        const { AuthService } = await import('@/lib/AuthService');
        
        // Register the user
        const user = await AuthService.registerUser({
            name,
            email,
            password,
            role
        });

        // Automatically log the user in
        const { accessToken, refreshToken } = await AuthService.authenticateUser(
            email,
            password,
            req.headers.get('user-agent') || 'Unknown',
            req.headers.get('x-forwarded-for') || 'Unknown'
        );

        // Set auth cookies
        await AuthService.setAuthCookies(accessToken, refreshToken);

        return NextResponse.json({ message: 'User registered successfully', role: user.role }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
