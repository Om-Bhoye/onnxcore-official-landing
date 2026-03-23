'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectParams = searchParams.get('redirect') || '/dashboard';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push(redirectParams);
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to login');
            }
        } catch {
            setError('An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
            <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Sign In</h1>
                    <p className="mt-2 text-indigo-300/60">Manage your business dashboard</p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <input
                            type="email"
                            required
                            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            required
                            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-2">
                    <p className="text-sm text-indigo-300/40">
                        Don't have an account?{' '}
                        <a href="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign Up
                        </a>
                    </p>
                    <p className="text-xs text-indigo-300/30">
                        <a href="/vendor/apply" className="hover:text-indigo-300 transition-colors">
                            Applying as a vendor? Register your business here.
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
