'use client';

import React, { useState } from 'react';
import { 
    Search, 
    RefreshCcw, 
    ChevronDown, 
    TrendingUp,
    TrendingDown,
    Calendar,
    BarChart3,
    CheckCircle2,
    Target,
    Activity,
    LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data for Transaction Statistics
const MOCK_STATS = [
    {
        id: 'STAT-001',
        date: '2024-03-30',
        currency: 'USDT',
        fiat: 'USD',
        direction: 'Buy',
        successAmount: '12,500.00',
        successQty: '12,240.00',
        numSuccess: 142,
        successRate: '98.5%'
    },
    {
        id: 'STAT-002',
        date: '2024-03-29',
        currency: 'BTC',
        fiat: 'EUR',
        direction: 'Sell',
        successAmount: '45,800.00',
        successQty: '0.68',
        numSuccess: 28,
        successRate: '92.0%'
    },
    {
        id: 'STAT-003',
        date: '2024-03-28',
        currency: 'ETH',
        fiat: 'USD',
        direction: 'Buy',
        successAmount: '32,100.00',
        successQty: '9.05',
        numSuccess: 64,
        successRate: '95.8%'
    },
    {
        id: 'STAT-004',
        date: '2024-03-27',
        currency: 'USDT',
        fiat: 'INR',
        direction: 'Sell',
        successAmount: '850,000.00',
        successQty: '845,000.00',
        numSuccess: 912,
        successRate: '99.2%'
    },
    {
        id: 'STAT-005',
        date: '2024-03-26',
        currency: 'USDT',
        fiat: 'USD',
        direction: 'Buy',
        successAmount: '18,200.00',
        successQty: '17,950.00',
        numSuccess: 156,
        successRate: '97.4%'
    }
];

export default function StatsPage() {
    const [stats] = useState(MOCK_STATS);

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-1000">
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Stats</h1>
                    <p className="text-indigo-100/40 text-sm mt-1">Detailed performance and success metrics for your transactions</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Avg Success Rate</span>
                            <span className="text-sm font-black text-emerald-400">96.58%</span>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Target className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Area */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="min-w-[160px] flex-1 max-w-[200px]">
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/50 appearance-none cursor-pointer">
                                <option value="">Transaction currency</option>
                                <option value="USDT">USDT</option>
                                <option value="BTC">BTC</option>
                                <option value="ETH">ETH</option>
                            </select>
                        </div>
                        <div className="min-w-[160px] flex-1 max-w-[200px]">
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
                                <option value="">Trading Fiat</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="INR">INR</option>
                            </select>
                        </div>
                        <div className="min-w-[140px] flex-1 max-w-[180px]">
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
                                <option value="">Direction</option>
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                            </select>
                        </div>
                        <div className="min-w-[280px] flex-1">
                            <div className="flex items-center gap-2 bg-slate-950 border border-white/5 rounded-xl px-3 py-1">
                                <Calendar className="w-4 h-4 text-white/20 ml-1" />
                                <input type="date" className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none [color-scheme:dark] py-1.5" />
                                <span className="text-white/20">~</span>
                                <input type="date" className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none [color-scheme:dark] py-1.5" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                            <button className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Check
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:text-white hover:bg-white/10 transition-all">
                                <RefreshCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Date</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Transaction currency</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Trading Fiat</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Direction</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Successful Amount</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Successful Quantity</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">No. of Successful</th>
                                <th className="px-6 py-5 text-right text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Success Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.map((row) => (
                                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5 text-sm font-medium text-white/80 font-mono whitespace-nowrap">
                                        {row.date}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <div className="w-7 h-7 rounded bg-white/5 border border-white/5 flex items-center justify-center">
                                                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                                            </div>
                                            <span className="text-sm font-bold text-white">{row.currency}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-white/60 whitespace-nowrap">
                                        {row.fiat}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className={cn(
                                            "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider",
                                            row.direction === 'Buy' ? "text-emerald-400" : "text-rose-400"
                                        )}>
                                            {row.direction === 'Buy' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {row.direction}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col whitespace-nowrap">
                                            <span className="text-sm font-black text-white">${row.successAmount}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-indigo-100/60 whitespace-nowrap">
                                        {row.successQty} <span className="text-[10px] font-normal opacity-40">{row.currency}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <span className="text-sm font-bold text-white">{row.numSuccess}</span>
                                            <CheckCircle2 className="w-3 h-3 text-emerald-500/40" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right whitespace-nowrap">
                                        <div className="inline-flex items-center gap-2 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                                            <LineChart className="w-3 h-3 text-emerald-500/50" />
                                            <span className="text-sm font-black text-emerald-400">{row.successRate}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <p className="text-xs text-indigo-100/30 font-bold uppercase tracking-widest">Total {stats.length} Days Record</p>
                        <select className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white font-bold uppercase focus:outline-none">
                            <option className="bg-slate-900">10/page</option>
                            <option className="bg-slate-900">20/page</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/20">1</button>
                        <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-indigo-100/40 text-xs font-bold hover:text-white transition-all">2</button>
                        <div className="flex items-center gap-2 ml-4">
                            <span className="text-[10px] text-white/20 uppercase font-bold">Go to</span>
                            <input type="text" defaultValue="1" className="w-10 bg-slate-900 border border-white/10 rounded-lg px-1 py-1 text-[10px] text-white text-center font-bold focus:outline-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
