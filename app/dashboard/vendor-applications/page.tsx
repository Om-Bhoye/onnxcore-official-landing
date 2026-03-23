import { getCurrentUser, canApproveRoles } from '@/lib/auth/rbac';
import { redirect } from 'next/navigation';
import VendorApplicationsContent from '@/components/dashboard/VendorApplicationsContent';

export default async function VendorApplicationsPage() {
    const user = await getCurrentUser();

    if (!user || !canApproveRoles(user)) {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-slate-950 p-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Vendor Applications</h1>
                    <p className="mt-2 text-indigo-300/60 text-sm">Review incoming business registration requests from prospective vendors</p>
                </header>
                <VendorApplicationsContent />
            </div>
        </div>
    );
}
