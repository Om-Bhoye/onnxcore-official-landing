import dbConnect from '@/lib/dbConnect';
import User, { UserRole, APPROVER_ROLES } from '@/lib/models/User';
import { cookies } from 'next/headers';
import { verifyAccessToken } from './tokens';

/**
 * Hardcoded permissions map for each role.
 */
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    super_admin: ['*'],
    c_level_admin: [
        'user.read.any',
        'user.create.any',
        'user.update.any',
        'role_request.approve',
        'role_request.reject',
        'role_request.read',
        'activity.approve',
        'activity.read',
        'finance.read',
        'finance.manage',
        'system.read',
        'vendor_app.read',
        'vendor_app.approve',
    ],
    admin: [
        'user.read.any',
        'user.create.any',
        'activity.approve',
        'activity.read',
        'system.read',
    ],
    business_dev: [
        'activity.read',
        'activity.create',
        'lead.read',
        'lead.create',
        'lead.update',
        'report.read',
    ],
    merchant_ops: [
        'merchant.read',
        'merchant.update',
        'inventory.read',
        'inventory.update',
        'activity.read',
    ],
    customer_support: [
        'ticket.read',
        'ticket.update',
        'ticket.create',
        'user.read.own',
        'activity.read',
    ],
    vendor: [
        'product.read.own',
        'product.create.own',
        'product.update.own',
        'order.read.own',
        'finance.read.own',
        'kyc.manage',
    ],
    merchant: [
        'product.read.own',
        'order.read.own',
        'order.create.own',
        'inventory.read.own',
    ],
    end_user: [
        'profile.read.own',
        'profile.update.own',
        'order.read.own',
    ],
};

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) return null;

    const payload = await verifyAccessToken(token);
    if (!payload) return null;

    await dbConnect();

    const user = await User.findById(payload.userId);
    return user;
}

export function hasPermission(user: any, requiredAction: string): boolean {
    if (!user || !user.role) return false;
    if (user.status !== 'active') return false;

    const role: UserRole = user.role;
    if (role === 'super_admin') return true;

    const permissions = ROLE_PERMISSIONS[role];
    if (!permissions) return false;

    return permissions.includes(requiredAction);
}

export function hasRole(user: any, roleName: UserRole): boolean {
    if (!user || !user.role) return false;
    return user.role === roleName;
}

export function canApproveRoles(user: any): boolean {
    if (!user || !user.role) return false;
    return APPROVER_ROLES.includes(user.role);
}

export { ROLE_PERMISSIONS };
