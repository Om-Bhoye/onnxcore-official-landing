import { getCurrentUser } from '@/lib/auth/rbac';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const needsKYC = user.role === 'vendor' && user.kycStatus === 'not_started';

    return (
        <div className="min-h-screen bg-slate-950 p-6 sm:p-10">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <header className="mb-10 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-3xl">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                        <p className="mt-2 text-indigo-300/60">
                            Welcome back, <span className="font-semibold text-white">{user.name}</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 border border-indigo-500/20">
                            {user.role}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-medium border ${
                            user.kycStatus === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                            KYC: {user.kycStatus.replace('_', ' ')}
                        </span>
                    </div>
                </header>

                {/* KYC Prompt for Vendors */}
                {needsKYC && (
                    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-8 shadow-2xl shadow-amber-500/10">
                            <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-amber-400">Complete Your KYC</h2>
                                    <p className="text-amber-100/60 max-w-xl text-sm">
                                        To protect our community and comply with regulations, we need you to verify your identity. Complete this step to unlock payouts and product listings.
                                    </p>
                                </div>
                                <a
                                    href="/kyc"
                                    className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-8 py-3.5 text-sm font-bold text-slate-950 transition-all hover:bg-amber-400 hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/20"
                                >
                                    Complete KYC
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Placeholder */}
                <div className="grid gap-6 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                            <div className="h-4 w-1/2 rounded bg-white/10 mb-4 animate-pulse" />
                            <div className="h-24 rounded bg-white/[0.02]" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
