'use client';

import React, { useState } from 'react';
import { 
    Search, 
    RefreshCcw, 
    ChevronDown, 
    ArrowUpRight,
    Filter,
    CreditCard,
    Wallet,
    Building2,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const assets = ['USDT', 'BTC', 'ETH', 'USDC', 'BNB', 'SOL'];
const fiatCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
const paymentMethods = ['All Payments', 'UPI', 'Bank Transfer', 'PhonePe', 'Paytm', 'IMPS'];

type Offer = {
    id: string;
    advertiser: {
        name: string;
        initials: string;
        trades: number;
        completion: string;
    };
    price: string;
    currency: string;
    available: string;
    limitMin: string;
    limitMax: string;
    payments: string[];
};

const mockOffers: Offer[] = [
    {
        id: '1',
        advertiser: { name: 'User-269475', initials: 'Us', trades: 7, completion: '98.5%' },
        price: '98',
        currency: 'INR',
        available: '1.77117 USDT',
        limitMin: '800',
        limitMax: '8000',
        payments: ['UPI']
    },
    {
        id: '2',
        advertiser: { name: 'User-257357', initials: 'Us', trades: 40, completion: '100%' },
        price: '98.99',
        currency: 'INR',
        available: '14.134867 USDT',
        limitMin: '1300',
        limitMax: '40000',
        payments: ['UPI', 'PhonePe', 'Paytm']
    },
    {
        id: '3',
        advertiser: { name: 'Ahaan 143', initials: 'Ah', trades: 13, completion: '95%' },
        price: '99',
        currency: 'INR',
        available: '18.931288 USDT',
        limitMin: '1000',
        limitMax: '200000',
        payments: ['UPI', 'IMPS', 'Paytm']
    },
    {
        id: '4',
        advertiser: { name: 'User-263932', initials: 'Us', trades: 36, completion: '99.2%' },
        price: '100',
        currency: 'INR',
        available: '19.057803 USDT',
        limitMin: '1700',
        limitMax: '20000',
        payments: ['UPI']
    },
    {
        id: '5',
        advertiser: { name: 'User-270145', initials: 'Us', trades: 25, completion: '97.8%' },
        price: '100.5',
        currency: 'INR',
        available: '18.051368 USDT',
        limitMin: '3000',
        limitMax: '20000',
        payments: ['UPI', 'PhonePe']
    }
];

export default function MarketPage() {
    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [selectedAsset, setSelectedAsset] = useState('USDT');
    const [selectedFiat, setSelectedFiat] = useState('INR');
    const [selectedPayment, setSelectedPayment] = useState('All Payments');

    return (
        <div className="min-h-screen bg-slate-950 p-6 sm:p-10">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header Section */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Market</h1>
                        <p className="text-indigo-300/60 text-sm">P2P Crypto Marketplace. Trade assets securely.</p>
                    </div>
                </div>

                {/* Trade Controls Card */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-1 backdrop-blur-3xl overflow-hidden">
                    <div className="p-6 space-y-6">
                        {/* Side & Asset Row */}
                        <div className="flex flex-col gap-6 md:flex-row md:items-center">
                            {/* Buy/Sell Selector */}
                            <div className="inline-flex p-1 bg-slate-900/50 rounded-2xl border border-white/5 self-start">
                                <button
                                    onClick={() => setSide('buy')}
                                    className={cn(
                                        "px-8 py-2.5 rounded-xl text-sm font-bold transition-all",
                                        side === 'buy' 
                                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                                            : "text-slate-400 hover:text-white"
                                    )}
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={() => setSide('sell')}
                                    className={cn(
                                        "px-8 py-2.5 rounded-xl text-sm font-bold transition-all",
                                        side === 'sell' 
                                            ? "bg-red-500 text-white shadow-lg shadow-red-500/20" 
                                            : "text-slate-400 hover:text-white"
                                    )}
                                >
                                    Sell
                                </button>
                            </div>

                            {/* Asset Selector */}
                            <div className="flex flex-wrap gap-2">
                                {assets.map((asset) => (
                                    <button
                                        key={asset}
                                        onClick={() => setSelectedAsset(asset)}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium transition-all relative",
                                            selectedAsset === asset 
                                                ? "text-white" 
                                                : "text-slate-500 hover:text-slate-300"
                                        )}
                                    >
                                        {asset}
                                        {selectedAsset === asset && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">Amount</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        placeholder="Enter amount" 
                                        className="w-full h-12 bg-slate-900/50 border border-white/5 rounded-2xl px-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">{selectedFiat}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">Fiat Currency</label>
                                <div className="relative group">
                                    <select 
                                        value={selectedFiat}
                                        onChange={(e) => setSelectedFiat(e.target.value)}
                                        className="w-full h-12 bg-slate-900/50 border border-white/5 rounded-2xl px-4 text-sm text-white appearance-none focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer"
                                    >
                                        {fiatCurrencies.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1">Payment Method</label>
                                <div className="relative group">
                                    <select 
                                        value={selectedPayment}
                                        onChange={(e) => setSelectedPayment(e.target.value)}
                                        className="w-full h-12 bg-slate-900/50 border border-white/5 rounded-2xl px-4 text-sm text-white appearance-none focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer"
                                    >
                                        {paymentMethods.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2 lg:col-span-2 flex items-end gap-3">
                                <Button className="h-12 flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                                    Search Offers
                                </Button>
                                <Button variant="ghost" className="h-12 w-12 rounded-2xl border border-white/5 bg-slate-900/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all outline-none ring-0">
                                    <RefreshCcw className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-3xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Advertiser</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Price</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Limits & Quantity</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Payment Methods</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {mockOffers.map((offer) => (
                                    <tr key={offer.id} className="group hover:bg-white/[0.03] transition-colors">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-indigo-400 group-hover:border-indigo-500/50 transition-colors">
                                                    {offer.advertiser.initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{offer.advertiser.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">
                                                        {offer.advertiser.trades} trades | {offer.advertiser.completion} completion
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-mono">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-white leading-none">{offer.price} {offer.currency}</span>
                                                <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                                                    Best Price <Shield className="w-2.5 h-2.5" />
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-[11px] font-medium max-w-[140px]">
                                                    <span className="text-slate-500">Available:</span>
                                                    <span className="text-slate-300 font-mono tracking-tight">{offer.available}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px] font-medium max-w-[140px]">
                                                    <span className="text-slate-500">Limit:</span>
                                                    <span className="text-slate-300 font-mono tracking-tight">{offer.limitMin}-{offer.limitMax} {offer.currency}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-wrap gap-2">
                                                {offer.payments.map((p, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="px-2 py-1 rounded bg-slate-900/50 border border-white/5 text-[10px] font-bold text-indigo-300/80"
                                                    >
                                                        {p}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button 
                                                className={cn(
                                                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg",
                                                    side === 'buy' 
                                                        ? "bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-450 hover:scale-105" 
                                                        : "bg-red-500 text-white shadow-red-500/20 hover:bg-red-450 hover:scale-105"
                                                )}
                                            >
                                                {side === 'buy' ? 'Buy USDT' : 'Sell USDT'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex items-center justify-between text-slate-500 text-xs px-2">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span>All trades are protected by escrow and 24/7 support.</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="hover:text-white transition-colors">Safety Tips</button>
                        <button className="hover:text-white transition-colors">P2P Tutorial</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
