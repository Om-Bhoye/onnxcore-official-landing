import { getCurrentUser, hasPermission } from '@/lib/auth/rbac';

interface RequirePermissionProps {
    permission: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default async function RequirePermission({
    permission,
    children,
    fallback = null
}: RequirePermissionProps) {
    const user = await getCurrentUser();

    if (!user) return <>{fallback}</>;

    const canAccess = hasPermission(user, permission);

    if (!canAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
