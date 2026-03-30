'use client';

import React, { useState } from 'react';
import { 
    Search, 
    Download, 
    RefreshCcw, 
    ChevronDown, 
    ChevronUp,
    Filter,
    MoreHorizontal,
    Eye,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Clock,
    XCircle,
    Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock Data
const MOCK_ORDERS = [
    {
        id: 'ORD-2024-001',
        amount: '2,500.00',
        currency: 'USD',
        transactions: 12,
        direction: 'Buy',
        fees: '12.50',
        utr: 'UTR82930412B',
        paymentDetails: 'Visa Debit **** 4242',
        payor: 'John Doe',
        startTime: '2024-03-30 14:20:00',
        endTime: '2024-03-30 14:25:00',
        orderType: 'Market',
        status: 'Completed'
    },
    {
        id: 'ORD-2024-002',
        amount: '12,000.00',
        currency: 'USDT',
        transactions: 45,
        direction: 'Buy',
        fees: '60.00',
        utr: 'TXN91028341A',
        paymentDetails: 'USDT-TRC20 Wallet',
        payor: 'Alice Smith',
        startTime: '2024-03-30 15:45:12',
        endTime: '2024-03-30 15:50:10',
        orderType: 'Limit',
        status: 'Processing'
    },
    {
        id: 'ORD-2024-003',
        amount: '850.00',
        currency: 'EUR',
        transactions: 3,
        direction: 'Sell',
        fees: '4.25',
        utr: 'BNK48192038D',
        paymentDetails: 'IBAN: DE19 **** 391',
        payor: 'Bob Wilson',
        startTime: '2024-03-29 09:12:44',
        endTime: '2024-03-29 09:12:44',
        orderType: 'Market',
        status: 'Failed'
    },
    {
        id: 'ORD-2024-004',
        amount: '4,200.00',
        currency: 'USD',
        transactions: 8,
        direction: 'Sell',
        fees: '21.00',
        utr: 'PPL39102834E',
        paymentDetails: 'paypal@example.com',
        payor: 'Charlie Brown',
        startTime: '2024-03-28 18:30:10',
        endTime: '2024-03-28 18:45:12',
        orderType: 'Limit',
        status: 'Completed'
    },
    {
        id: 'ORD-2024-005',
        amount: '1,500.00',
        currency: 'INR',
        transactions: 5,
        direction: 'Buy',
        fees: '7.50',
        utr: 'RZP91823091F',
        paymentDetails: 'UPI: abinash@okaxis',
        payor: 'Abinash Das',
        startTime: '2024-03-30 20:10:05',
        endTime: '-',
        orderType: 'Market',
        status: 'Processing'
    }
];

const StatusBadge = ({ status }: { status: string }) => {
    const statusStyles: Record<string, string> = {
        'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        'Processing': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        'Failed': 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const StatusIcon = {
        'Completed': CheckCircle2,
        'Processing': Clock,
        'Failed': XCircle,
    }[status] || Clock;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider",
            statusStyles[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
        )}>
            <StatusIcon className="w-3 h-3" />
            {status}
        </div>
    );
};

export default function OrdersPage() {
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const [orders] = useState(MOCK_ORDERS);

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Orders</h1>
                    <p className="text-indigo-100/40 text-sm mt-1">Manage and track your transaction history</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                        New Order
                    </button>
                    <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:text-white hover:bg-white/10 transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="p-6 space-y-6">
                    {/* Primary Filters + Actions */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <input 
                                type="text" 
                                placeholder="Order Id" 
                                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all"
                            />
                        </div>
                        <div className="min-w-[160px]">
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all appearance-none cursor-pointer">
                                <option value="">Transaction currency</option>
                                <option value="USD">USD</option>
                                <option value="USDT">USDT</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                        <div className="min-w-[140px]">
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all appearance-none cursor-pointer">
                                <option value="">Direction</option>
                                <option value="buy">Buy</option>
                                <option value="sell">Sell</option>
                            </select>
                        </div>
                        <div className="min-w-[160px]">
                            <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-600/50 transition-all appearance-none cursor-pointer">
                                <option value="">Payment</option>
                                <option value="visa">Visa</option>
                                <option value="crypto">Crypto</option>
                                <option value="bank">Bank</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20">
                                <Search className="w-4 h-4" />
                                Check
                            </button>
                            <button className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-sm font-bold transition-all flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:text-white hover:bg-white/10 transition-all">
                                <RefreshCcw className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:text-white hover:bg-white/10 transition-all ml-2"
                            >
                                {isFilterExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Collapsible Section */}
                    <AnimatePresence>
                        {isFilterExpanded && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Payor Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="Payor Name" 
                                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/10 focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Order Status</label>
                                        <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
                                            <option value="">Order status</option>
                                            <option value="completed">Completed</option>
                                            <option value="processing">Processing</option>
                                            <option value="failed">Failed</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Order Type</label>
                                        <select className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer">
                                            <option value="">Order Type</option>
                                            <option value="market">Market</option>
                                            <option value="limit">Limit</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Date Range</label>
                                        <div className="flex gap-2">
                                            <input type="date" className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none [color-scheme:dark]" />
                                            <span className="text-white/20 self-center">~</span>
                                            <input type="date" className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none [color-scheme:dark]" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold ml-1">Amount Range (₹)</label>
                                        <div className="flex gap-2">
                                            <input type="number" placeholder="Min" className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
                                            <span className="text-white/20 self-center">→</span>
                                            <input type="number" placeholder="Max" className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Order Id</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Amount</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Transactions</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Direction</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Fees</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">UTR</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Payment method details</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Payor Name</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Start Time</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">End Time</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Order Type</th>
                                <th className="px-6 py-5 text-left text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Order Status</th>
                                <th className="px-6 py-5 text-right text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] whitespace-nowrap">Operate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map((order, idx) => (
                                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-white tracking-tight whitespace-nowrap">{order.id}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                                            <span className="text-sm font-black text-white">{order.amount}</span>
                                            <span className="text-[10px] font-bold text-indigo-400/60 uppercase">{order.currency}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm text-indigo-100/60 font-medium whitespace-nowrap">{order.transactions}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={cn(
                                            "flex items-center gap-1.5 text-sm font-bold whitespace-nowrap",
                                            order.direction === 'Buy' ? "text-emerald-400" : "text-rose-400"
                                        )}>
                                            {order.direction === 'Buy' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                            {order.direction}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-white/40 italic whitespace-nowrap">
                                        ${order.fees}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-white/70 tracking-tight whitespace-nowrap">{order.utr}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                                                <Package className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <span className="text-sm text-white/70 font-medium">{order.paymentDetails}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-white/70 whitespace-nowrap">
                                        {order.payor}
                                    </td>
                                    <td className="px-6 py-5 text-xs text-white/40 font-mono whitespace-nowrap">
                                        {order.startTime}
                                    </td>
                                    <td className="px-6 py-5 text-xs text-white/40 font-mono whitespace-nowrap">
                                        {order.endTime}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className="px-2 py-1 rounded bg-indigo-500/5 text-indigo-400 text-[10px] font-bold uppercase border border-indigo-500/10">
                                            {order.orderType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-5 text-right whitespace-nowrap">
                                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:text-white hover:bg-white/10 transition-all shadow-sm">
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
                    <p className="text-xs text-indigo-100/30">Showing 1 to {orders.length} of {orders.length} entries</p>
                    <div className="flex items-center gap-2">
                        <button disabled className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/10 cursor-not-allowed">
                            <ChevronDown className="w-4 h-4 rotate-90" />
                        </button>
                        <button className="w-8 h-8 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/20">1</button>
                        <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-indigo-100/40 text-xs font-bold hover:text-white transition-all">2</button>
                        <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-indigo-100/40 text-xs font-bold hover:text-white transition-all">3</button>
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-indigo-400 hover:text-white hover:bg-white/10 transition-all">
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
