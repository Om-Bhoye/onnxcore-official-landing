'use client';

import React from 'react';
import { BarChart3, Construction } from 'lucide-react';

export default function TradingPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
                <div className="relative h-24 w-24 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shadow-2xl">
                    <BarChart3 className="h-12 w-12 text-indigo-400" />
                </div>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Advanced Trading</h1>
            <p className="text-indigo-100/40 max-w-md mb-10 leading-relaxed italic">
                Our high-performance trading engine is currently being optimized for lightning-fast execution and institutional-grade tools.
            </p>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-amber-400 font-bold uppercase tracking-widest text-xs animate-in slide-in-from-bottom-4 duration-1000">
                <Construction className="w-4 h-4" />
                Coming Soon
            </div>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                {['Spot Trading', 'Futures', 'Margin', 'Bots'].map((feature) => (
                    <div key={feature} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-500 font-medium text-sm">
                        {feature}
                    </div>
                ))}
            </div>
        </div>
    );
}
