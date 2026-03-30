'use client';

import React, { useState } from 'react';
import { 
    Search, 
    Download, 
    RefreshCcw, 
    ChevronDown, 
    ChevronUp,
    Plus,
    MoreHorizontal,
    Eye,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    Clock,
    XCircle,
    BadgeDollarSign,
    Layers,
    ArrowRightLeft,
    BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data for Advertisements
const MOCK_ADVERTISES = [
    {
        id: 'ADV-1001',
        currency: 'USDT',
        fiat: 'USD',
        numAdvertises: 24,
        matchableQty: '12,500.00',
        numTransactions: 156,
        amountTraded: '48,290.00',
        direction: 'Buy',
        priceType: 'Floating',
        currentPrice: '1.02',
        limitOrder: 'Min 100 - Max 5,000',
        paymentMethod: 'Multiple (Visa, ACH)',
        startTime: '2024-03-20 08:00',
        endTime: '2024-04-20 23:59',
        status: 'Normal',
        listingStatus: 'Visible'
    },
    {
        id: 'ADV-1002',
        currency: 'BTC',
        fiat: 'EUR',
        numAdvertises: 8,
        matchableQty: '0.45',
        numTransactions: 89,
        amountTraded: '31,200.00',
        direction: 'Sell',
        priceType: 'Fixed',
        currentPrice: '67,420.00',
        limitOrder: 'Min 500 - Max 20,000',
        paymentMethod: 'Bank Transfer (SEPA)',
        startTime: '2024-03-25 10:30',
        endTime: '2024-03-30 18:00',
        status: 'Normal',
        listingStatus: 'Visible'
    },
    {
        id: 'ADV-1003',
        currency: 'ETH',
        fiat: 'GPB',
        numAdvertises: 12,
        matchableQty: '5.20',
        numTransactions: 42,
        amountTraded: '18,500.00',
        direction: 'Buy',
        priceType: 'Floating',
        currentPrice: '3,540.00',
        limitOrder: 'Min 200 - Max 10,000',
        paymentMethod: 'Revolut',
        startTime: '2024-03-28 14:00',
        endTime: '2024-03-29 14:00',
        status: 'Paused',
        listingStatus: 'Hidden'
    },
    {
        id: 'ADV-1004',
        currency: 'USDT',
        fiat: 'INR',
        numAdvertises: 56,
        matchableQty: '500,000.00',
        numTransactions: 890,
        amountTraded: '45,000,000.00',
        direction: 'Buy',
        priceType: 'Floating',
        currentPrice: '88.45',
        limitOrder: 'Min 10,000 - Max 1,000,000',
        paymentMethod: 'IMPS/UPI',
        startTime: '2024-03-01 00:00',
        endTime: '2024-12-31 23:59',
        status: 'Normal',
        listingStatus: 'Visible'
    }
];

const StatusBadge = ({ status, type }: { status: string, type: 'advertise' | 'listing' }) => {
    const isAdvertise = type === 'advertise';
    
    const colors: Record<string, string> = {
        'Normal': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'Paused': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'Visible': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        'Hidden': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };

    return (
        <div className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider",
            colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
        )}>
            {status}
        </div>
    );
};

export default function AdvertisePage() {
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [advertises] = useState(MOCK_ADVERTISES);

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-1000">
            {/* Header Area */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Advertise</h1>
                    <p className="text-indigo-100/40 text-sm mt-1">Configure and manage your point-to-point trading advertisements</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create New Ad
                    </button>
                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:text-white hover:bg-white/10 transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Filters Area */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="p-6 space-y-6">
                    {/* Primary Row */}
                    <div className="flex items-center gap-3">
                        <div className="min-w-[100px] flex-1 max-w-[140px]">
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/50 appearance-none cursor-pointer">
                                <option value="">Fiat</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="INR">INR</option>
                            </select>
                        </div>
                        <div className="min-w-[140px] flex-1">
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
                                <option value="">Advertise currency</option>
                                <option value="USDT">USDT</option>
                                <option value="BTC">BTC</option>
                                <option value="ETH">ETH</option>
                            </select>
                        </div>
                        <div className="min-w-[140px] flex-1">
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
                                <option value="">Advertise Direction</option>
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                            </select>
                        </div>
                        <div className="min-w-[140px] flex-1">
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
                                <option value="">Type of Price</option>
                                <option value="floating">Floating</option>
                                <option value="fixed">Fixed</option>
                            </select>
                        </div>
                        <div className="min-w-[140px] flex-1">
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
                                <option value="">Advertise Status</option>
                                <option value="normal">Normal</option>
                                <option value="paused">Paused</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                            <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
                                Check
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:text-white hover:bg-white/10 transition-all">
                                <RefreshCcw className="w-4 h-4" />
                            </button>
                            <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
                                Add
                            </button>
                            <button 
                                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:text-white hover:bg-white/10 transition-all ml-2"
                            >
                                {isFilterExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Collapsible advanced filters */}
                    <AnimatePresence>
                        {isFilterExpanded && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Listing Status</label>
                                        <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none">
                                            <option value="">Listing Status</option>
                                            <option value="visible">Visible</option>
                                            <option value="hidden">Hidden</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">Start Time Range</label>
                                        <div className="flex gap-2">
                                            <input type="date" className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none [color-scheme:dark]" />
                                            <span className="text-white/20 self-center">~</span>
                                            <input type="date" className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none [color-scheme:dark]" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold ml-1">End Time Range</label>
                                        <div className="flex gap-2">
                                            <input type="date" className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none [color-scheme:dark]" />
                                            <span className="text-white/20 self-center">~</span>
                                            <input type="date" className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none [color-scheme:dark]" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Advertise currency</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Trading Fiat</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Number of Advertises</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Matchable quantity</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Number of Transactions</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Amount Traded</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Advertise Direction</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Type of Price</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Current Price</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Limit Order</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Payment Method</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Start Time</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">End Time</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Advertise Status</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Listing Status</th>
                                <th className="px-6 py-5 text-right text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Operate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {advertises.map((ad) => (
                                <tr key={ad.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                                <BadgeDollarSign className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <span className="text-sm font-bold text-white tracking-tight">{ad.currency}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-white/60 whitespace-nowrap">
                                        {ad.fiat}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-indigo-100/60 whitespace-nowrap">
                                        {ad.numAdvertises}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-black text-white whitespace-nowrap">
                                        {ad.matchableQty}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <BarChart3 className="w-3.5 h-3.5 text-indigo-100/20" />
                                            <span className="text-sm text-indigo-100/60">{ad.numTransactions}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-white whitespace-nowrap">
                                        ${ad.amountTraded}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className={cn(
                                            "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider",
                                            ad.direction === 'Buy' ? "text-emerald-400" : "text-rose-400"
                                        )}>
                                            {ad.direction === 'Buy' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                            {ad.direction}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-white/40 italic whitespace-nowrap">
                                        {ad.priceType}
                                    </td>
                                    <td className="px-6 py-5 text-sm font-black text-white whitespace-nowrap">
                                        {ad.currentPrice}
                                    </td>
                                    <td className="px-6 py-5 text-xs text-white/30 whitespace-nowrap italic">
                                        {ad.limitOrder}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <div className="w-7 h-7 rounded bg-white/5 border border-white/5 flex items-center justify-center">
                                                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                                            </div>
                                            <span className="text-sm text-white/70 font-medium">{ad.paymentMethod}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-[10px] text-white/20 font-mono whitespace-nowrap">
                                        {ad.startTime}
                                    </td>
                                    <td className="px-6 py-5 text-[10px] text-white/20 font-mono whitespace-nowrap">
                                        {ad.endTime}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <StatusBadge status={ad.status} type="advertise" />
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <StatusBadge status={ad.listingStatus} type="listing" />
                                    </td>
                                    <td className="px-6 py-5 text-right whitespace-nowrap">
                                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:text-white hover:bg-white/10 transition-all">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <p className="text-xs text-indigo-100/30 font-bold uppercase tracking-widest">Total {advertises.length} Ads</p>
                        <select className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white font-bold uppercase focus:outline-none">
                            <option className="bg-slate-900">10/page</option>
                            <option className="bg-slate-900">20/page</option>
                            <option className="bg-slate-900">50/page</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button disabled className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/10 cursor-not-allowed">
                            <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>
                        <button className="w-8 h-8 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/20">1</button>
                        <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-indigo-100/40 text-xs font-bold hover:text-white transition-all">2</button>
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:text-white hover:bg-white/10 transition-all">
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                        </button>
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
