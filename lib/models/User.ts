import mongoose, { Schema, Document } from 'mongoose';

export const USER_ROLES = [
    'super_admin',
    'c_level_admin',
    'admin',
    'business_dev',
    'merchant_ops',
    'customer_support',
    'vendor',
    'merchant',
    'end_user',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** Roles that can self-register via the signup page */
export const SELF_REGISTER_ROLES: UserRole[] = ['super_admin', 'c_level_admin', 'admin'];

/** Roles that require approval from a Super Admin or C-Level Admin */
export const APPROVAL_REQUIRED_ROLES: UserRole[] = [
    'business_dev',
    'merchant_ops',
    'customer_support',
    'vendor',
    'merchant',
    'end_user',
];

/** Roles that can approve other users' role requests */
export const APPROVER_ROLES: UserRole[] = ['super_admin', 'c_level_admin'];

export type UserStatus = 'pending' | 'active' | 'suspended';
export type KYCStatus = 'not_started' | 'pending' | 'completed';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    isEmailVerified: boolean;
    role: UserRole;
    status: UserStatus;
    kycStatus: KYCStatus;
    approvedBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: USER_ROLES,
            required: true,
            default: 'end_user',
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'suspended'],
            default: 'active',
        },
        kycStatus: {
            type: String,
            enum: ['not_started', 'pending', 'completed'],
            default: 'not_started',
        },
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
