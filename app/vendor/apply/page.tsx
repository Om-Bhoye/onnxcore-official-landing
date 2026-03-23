'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorApplyPage() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState('');
    const [companyBrandName, setCompanyBrandName] = useState('');
    const [officialWebsite, setOfficialWebsite] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/vendor/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    companyName, 
                    companyBrandName, 
                    officialWebsite, 
                    companyAddress, 
                    contactPerson, 
                    email, 
                    businessType 
                }),
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to submit application');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
                <div className="w-full max-w-md rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center backdrop-blur-xl">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Application Received!</h1>
                    <p className="mt-4 text-emerald-100/60">
                        Thank you for your application, <strong>{contactPerson}</strong>. We've received the details for <strong>{companyName}</strong> and will notify you at <strong>{email}</strong> shortly.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-8 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition-colors hover:bg-emerald-500"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
            <div className="w-full max-w-2xl space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Vendor Application</h1>
                    <p className="mt-2 text-indigo-300/60">Apply to become a verified vendor on our platform</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-indigo-200/80 mb-1.5">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                    placeholder="Enter registered company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-indigo-200/80 mb-1.5">Company Brand Name</label>
                                <input
                                    type="text"
                                    required
                                    value={companyBrandName}
                                    onChange={(e) => setCompanyBrandName(e.target.value)}
                                    className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                    placeholder="The name customers see"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-indigo-200/80 mb-1.5">Official Website</label>
                                <input
                                    type="text"
                                    required
                                    value={officialWebsite}
                                    onChange={(e) => setOfficialWebsite(e.target.value)}
                                    className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-indigo-200/80 mb-1.5">Contact Person</label>
                                <input
                                    type="text"
                                    required
                                    value={contactPerson}
                                    onChange={(e) => setContactPerson(e.target.value)}
                                    className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                    placeholder="Name of primary contact"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-indigo-200/80 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                    placeholder="contact@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-indigo-200/80 mb-1.5">Type of Business (Optional)</label>
                                <input
                                    type="text"
                                    value={businessType}
                                    onChange={(e) => setBusinessType(e.target.value)}
                                    className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                    placeholder="Retail, Wholesale, etc."
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-indigo-200/80 mb-1.5">Company Address</label>
                            <textarea
                                required
                                rows={3}
                                value={companyAddress}
                                onChange={(e) => setCompanyAddress(e.target.value)}
                                className="block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                placeholder="Full physical or registered address..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                    
                    <p className="text-center text-xs text-indigo-300/40 mt-4">
                        By submitting, you agree to our Terms of Service and Vendor Policy.
                    </p>
                </form>
            </div>
        </div>
    );
}
