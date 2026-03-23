'use client';

import { useState, useEffect } from 'react';

interface VendorApp {
    _id: string;
    companyName: string;
    companyBrandName: string;
    officialWebsite: string;
    companyAddress: string;
    contactPerson: string;
    email: string;
    businessType?: string;
    status: string;
    createdAt: string;
}

export default function VendorApplicationsContent() {
    const [apps, setApps] = useState<VendorApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchApps = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/vendor/applications');
            if (res.ok) {
                const data = await res.json();
                setApps(data.applications);
            }
        } catch {
            setError('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleReview = async (id: string, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(`/api/vendor/applications/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            if (res.ok) {
                fetchApps();
            } else {
                alert('Failed to process request');
            }
        } catch {
            alert('An error occurred');
        }
    };

    if (loading) return <div className="p-8 text-center text-indigo-300/50">Loading applications...</div>;

    return (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-wider text-indigo-300/70">
                        <th className="px-6 py-4">Company & Brand</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Website & Type</th>
                        <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {apps.map((app) => (
                        <tr key={app._id} className="text-sm text-white/80 hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-white">{app.companyName}</div>
                                <div className="text-[10px] text-indigo-400 font-mono uppercase tracking-tighter opacity-70">
                                    {app.companyBrandName}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-white/90">{app.contactPerson}</div>
                                <div className="text-xs text-indigo-300/50">{app.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-xs font-medium text-emerald-400/80 truncate max-w-[150px]">
                                    {app.officialWebsite}
                                </div>
                                <div className="text-[10px] text-white/30 italic">
                                    {app.businessType || 'N/A'}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleReview(app._id, 'approve')}
                                        className="rounded-lg bg-emerald-600/10 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReview(app._id, 'reject')}
                                        className="rounded-lg bg-red-600/10 px-3 py-1.5 text-xs font-bold text-red-400 border border-red-500/20 hover:bg-red-600/20 transition-all"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {apps.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-white/30">No pending vendor applications</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
