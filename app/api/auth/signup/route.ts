import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User, { UserRole, SELF_REGISTER_ROLES } from '@/lib/models/User';
import VendorApplication from '@/lib/models/VendorApplication';
import { hashPassword } from '@/lib/auth/password';
import { z } from 'zod';

const signupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.string(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parseResult = signupSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { name, email, password, role } = parseResult.data;

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // VENDOR RESTRICTION: If applying as a vendor, check for approved application
        if (role === 'vendor') {
            const approvedApp = await VendorApplication.findOne({
                email: email.toLowerCase(),
                status: 'approved'
            });

            if (!approvedApp) {
                return NextResponse.json({ 
                    error: 'Vendor signup requires an approved business application. Please apply first.' 
                }, { status: 403 });
            }
        } else if (!SELF_REGISTER_ROLES.includes(role as UserRole)) {
            // Other roles (except self-registering admins) also require logic, 
            // but for now we follow the user's specific vendor request.
            return NextResponse.json({ error: 'Unauthorized role selection' }, { status: 403 });
        }

        const passwordHash = await hashPassword(password);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role: role as UserRole,
            status: 'active',
            kycStatus: 'not_started',
        });

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
