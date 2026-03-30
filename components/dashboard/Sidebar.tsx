'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    User, 
    Settings, 
    LogOut, 
    Home, 
    Gift,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    ShoppingCart,
    BarChart3,
    Wallet,
    ClipboardList,
    Megaphone
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Market', href: '/dashboard/market', icon: ShoppingCart },
    { label: 'Orders', href: '/dashboard/orders', icon: ClipboardList },
    { label: 'Advertise', href: '/dashboard/advertise', icon: Megaphone },
    { label: 'Stats', href: '/dashboard/stats', icon: BarChart3 },
    { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
];

const secondaryItems = [
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/user/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => setUserData(data))
            .catch(() => {});
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <aside 
            className={cn(
                "relative h-screen bg-slate-950 border-r border-white/10 transition-all duration-300 flex flex-col z-40",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header / Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/20">
                    <span className="text-white font-bold text-xl">O</span>
                </div>
                {!isCollapsed && (
                    <span className="text-white font-bold text-lg tracking-tight">OnnXcore</span>
                )}
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto">
                {mainItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                                isActive 
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                                    : "text-indigo-100/40 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "group-hover:text-indigo-400")} />
                            {!isCollapsed && (
                                <span className="text-sm font-medium">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Account Management Links (at bottom) */}
            <div className="px-3 space-y-1 mb-2">
                {!isCollapsed && (
                    <div className="px-3 py-2">
                        <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em] mb-2 block">Account</span>
                    </div>
                )}
                {secondaryItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link 
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                                isActive 
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                                    : "text-indigo-100/40 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "group-hover:text-indigo-400")} />
                            {!isCollapsed && (
                                <span className="text-sm font-medium">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 space-y-4">
                {userData && !isCollapsed && (
                    <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.03] border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                        <div className="h-10 w-10 rounded-full border border-white/10 overflow-hidden bg-slate-900 flex-shrink-0">
                            {userData.profileImage ? (
                                <img src={userData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase italic">
                                    {userData.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{userData.name}</p>
                            <p className="text-[10px] text-indigo-100/30 truncate uppercase tracking-widest">{userData.role}</p>
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all group"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400 hover:text-white shadow-xl"
            >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
        </aside>
    );
}
