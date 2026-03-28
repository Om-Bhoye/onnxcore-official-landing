'use client';

import React, { useState } from 'react';
import { 
    Eye, 
    EyeOff, 
    ArrowUpFromLine, 
    ArrowDownToLine, 
    ChevronRight,
    TrendingUp,
    TrendingDown,
    ChevronDown,
    ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

const chartData = [
    { name: 'Mon', value: 420 },
    { name: 'Tue', value: 435 },
    { name: 'Wed', value: 428 },
    { name: 'Thu', value: 445 },
    { name: 'Fri', value: 440 },
    { name: 'Sat', value: 458 },
    { name: 'Sun', value: 451.44078 },
];

const assets = [
    { symbol: 'USDT', name: 'Tether', balance: '451.44078', fiatValue: '42,745.51', color: '#26A17B', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=032' },
    { symbol: 'BTC', name: 'Bitcoin', balance: '0.00', fiatValue: '0.00', color: '#F7931A', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032' },
    { symbol: 'ETH', name: 'Ethereum', balance: '0.00', fiatValue: '0.00', color: '#627EEA', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=032' },
    { symbol: 'BNB', name: 'BNB', balance: '0.00', fiatValue: '0.00', color: '#F3BA2F', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=032' },
    { symbol: 'USDC', name: 'USDC', balance: '0.00', fiatValue: '0.00', color: '#2775CA', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=032' },
    { symbol: 'TRX', name: 'TRON', balance: '0.00', fiatValue: '0.00', color: '#FF0013', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png?v=032' },
];

export default function WalletPage() {
    const [hideBalance, setHideBalance] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 p-6 sm:p-10">
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Wallet</h1>
                        <p className="mt-1 text-slate-500 text-sm">Manage your assets and track performance.</p>
                    </div>
                </header>

                {/* Equity Value Card */}
                <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-3xl p-8 lg:p-10 group transition-all hover:bg-white/[0.07]">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-slate-400 font-medium">
                                <span className="text-sm">Equity Value (USDT)</span>
                                <button 
                                    onClick={() => setHideBalance(!hideBalance)}
                                    className="p-1 hover:text-white transition-colors"
                                >
                                    {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            
                            <div className="space-y-1">
                                <div className="text-5xl lg:text-6xl font-black text-white tracking-tighter tabular-nums">
                                    {hideBalance ? '••••••••' : '451.44078'}
                                </div>
                                <div className="text-lg lg:text-xl font-medium text-slate-400 flex items-center gap-2">
                                    ≈ {hideBalance ? '••••' : '₹ 42,745.51'}
                                    <span className="text-emerald-400 text-sm font-bold flex items-center gap-0.5 ml-2 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                        <TrendingUp className="w-3 h-3" /> +2.4%
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button className="h-14 px-8 rounded-2xl bg-white text-slate-950 hover:bg-slate-200 font-bold transition-all active:scale-95 flex items-center gap-3 group/btn">
                                    <div className="bg-slate-950 rounded-full p-1 group-hover/btn:rotate-45 transition-transform duration-300">
                                        <ArrowUpFromLine className="w-4 h-4 text-white" />
                                    </div>
                                    Withdraw
                                </Button>
                                <Button className="h-14 px-8 rounded-2xl bg-slate-900 border border-white/10 text-white hover:bg-slate-800 font-bold transition-all active:scale-95 flex items-center gap-3">
                                    <div className="bg-indigo-600 rounded-full p-1">
                                        <ArrowDownToLine className="w-4 h-4 text-white" />
                                    </div>
                                    Deposit
                                </Button>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="h-48 lg:h-56 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#6366F1" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorValue)" 
                                        animationDuration={2000}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* All Assets Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="text-lg font-bold text-white tracking-tight">All assets</h2>
                        <Button variant="ghost" className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest gap-2">
                            Hide 0.00 balances <ChevronDown className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-white/5 overflow-hidden backdrop-blur-3xl">
                        <div className="divide-y divide-white/5">
                            {assets.map((asset) => (
                                <div key={asset.symbol} className="group flex items-center justify-between p-6 hover:bg-white/[0.03] transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center p-2.5 group-hover:scale-110 transition-transform">
                                            <img src={asset.icon} alt={asset.symbol} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors uppercase">{asset.symbol}</p>
                                            <p className="text-xs text-slate-500 font-medium">{asset.name}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-base font-bold text-white tabular-nums group-hover:translate-y-[-2px] transition-transform">
                                                {hideBalance ? '••••' : asset.balance}
                                            </p>
                                            <p className="text-xs font-medium text-slate-500 tabular-nums">
                                                Value: {hideBalance ? '••••' : `₹ ${asset.fiatValue}`}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Tip */}
                <div className="flex items-center justify-center gap-2 text-slate-500 text-xs py-10 opacity-60">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Assets are secured with multi-sig cold storage and protected by our insurance fund.</span>
                </div>
            </div>
        </div>
    );
}
