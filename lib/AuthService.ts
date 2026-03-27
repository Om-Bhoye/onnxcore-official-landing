import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import Session from '@/lib/models/Session';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/tokens';
import crypto from 'crypto';
import { cookies } from 'next/headers';

/**
 * AuthService
 * Centralized service for handling authentication and user-related operations.
 */
export const AuthService = {
    /**
     * Registers a new user in the system.
     */
    async registerUser({ name, email, password, role }: any) {
        await dbConnect();
        
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await hashPassword(password);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role,
            status: 'active',
            kycStatus: 'not_started',
            isActive: true,
        });

        return user;
    },

    /**
     * Authenticates a user and creates a session.
     */
    async authenticateUser(email: string, password: string, userAgent: string = 'Unknown', ipAddress: string = 'Unknown') {
        await dbConnect();
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !(await verifyPassword(password, user.passwordHash))) {
            throw new Error('Invalid credentials');
        }

        // Check if account is active
        if (!user.isActive) {
            throw new Error('your account is suspented, please contact the onxcore team');
        }

        // Generate tokens
        const accessToken = await generateAccessToken({ userId: user._id.toString() });
        const refreshToken = await generateRefreshToken({ userId: user._id.toString() });

        // Hash refresh token for security
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        
        // Session expiry (7 days)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Create DB session
        await Session.create({
            userId: user._id,
            refreshTokenHash,
            device: userAgent,
            ipAddress: ipAddress,
            expiresAt,
        });

        return { accessToken, refreshToken, user };
    },

    /**
     * Sets authentication cookies on the response.
     */
    async setAuthCookies(accessToken: string, refreshToken: string) {
        const cookieStore = await cookies();
        
        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60, // 15 minutes
        });

        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });
    }
};
