'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
    User, 
    Mail, 
    ShieldCheck, 
    Copy, 
    Check, 
    Upload, 
    Camera,
    ShieldAlert,
    ShieldQuestion,
    ExternalLink,
    Gift,
    Shield,
    AlertCircle
} from 'lucide-react';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import KYCForm from '@/components/dashboard/KYCForm';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copySuccess, setCopySuccess] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showKYC, setShowKYC] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [referralCode, setReferralCode] = useState('');

    const fetchUser = () => {
        fetch('/api/user/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                setUser(data);
                if (data?.referralCode) setReferralCode(data.referralCode);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        try {
            const firebaseUid = auth.currentUser?.uid;
            if (!firebaseUid) throw new Error('Not authenticated');

            const path = `profiles/${firebaseUid}/avatar.${file.name.split('.').pop()}`;
            const storageRef = ref(storage, path);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error('Upload error:', error);
                    setUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    
                    // Update database
                    await fetch('/api/user/profile', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ profileImage: downloadURL })
                    });

                    setUser({ ...user, profileImage: downloadURL });
                    setUploading(false);
                    setUploadProgress(0);
                }
            );
        } catch (error) {
            console.error('Upload Error:', error);
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!user) return <div className="p-10 text-white text-center">User not found</div>;

    const kycConfig = {
        'completed': {
            color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
            icon: <ShieldCheck className="w-5 h-5" />,
            label: 'Verified'
        },
        'pending': {
            color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
            icon: <ShieldQuestion className="w-5 h-5" />,
            label: 'Pending Review'
        },
        'rejected': {
            color: 'text-red-400 bg-red-400/10 border-red-400/20',
            icon: <AlertCircle className="w-5 h-5" />,
            label: 'Rejected'
        },
        'not_started': {
            color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
            icon: <ShieldAlert className="w-5 h-5" />,
            label: 'Unverified'
        }
    };

    const currentKyc = kycConfig[user.kycStatus as keyof typeof kycConfig] || kycConfig['not_started'];

    return (
        <div className="p-6 lg:p-12 max-w-6xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                    Account <span className="text-indigo-500">Settings</span>
                </h1>
                <p className="text-indigo-100/30 mt-2 text-lg">Manage your personal information and account security.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Avatar & KYC Quick Status */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 flex flex-col items-center text-center backdrop-blur-3xl shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-50" />
                        
                        <div className="relative mb-8 group">
                            <div className="h-40 w-40 rounded-full border-[6px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden group-hover:border-indigo-600/30 transition-all duration-500">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-5xl font-bold text-white uppercase italic">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute bottom-2 right-2 h-12 w-12 bg-indigo-600 rounded-full border-4 border-slate-950 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-2xl z-10 hover:bg-white hover:text-indigo-600"
                            >
                                <Camera className="w-6 h-6" />
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </div>

                        {uploading && (
                            <div className="w-40 h-1.5 bg-white/5 rounded-full mb-6 overflow-hidden">
                                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${uploadProgress}%` }} />
                            </div>
                        )}

                        <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <Shield className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                                {user.role} Vendor
                            </span>
                        </div>
                    </section>

                    <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-3xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-40">Identity Status</h3>
                            <div className={cn("px-3 py-1 rounded-lg text-[10px] font-bold border", currentKyc.color)}>
                                {currentKyc.label}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center bg-current/10", currentKyc.color.split(' ')[0])}>
                                        {currentKyc.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Verification Status</p>
                                        <p className="text-[10px] text-indigo-100/30 mt-0.5">
                                            {user.kycStatus === 'completed' ? 'Full account features unlocked' : 'Identity check required for expansion'}
                                        </p>
                                    </div>
                                </div>

                                {user.kycStatus === 'rejected' && user.kycDetails?.rejectionReason && (
                                    <div className="p-3 rounded-xl bg-red-400/5 border border-red-400/10">
                                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> Rejection Notes
                                        </p>
                                        <p className="text-xs text-red-100/60 leading-relaxed italic">
                                            "{user.kycDetails.rejectionReason}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {!showKYC && user.kycStatus !== 'completed' && (
                                <button 
                                    onClick={() => setShowKYC(true)}
                                    className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-indigo-600 hover:border-indigo-500 transition-all active:scale-[0.98]"
                                >
                                    {user.kycStatus === 'pending' ? 'Review Submission' : user.kycStatus === 'rejected' ? 'Restart Verification' : 'Verification Center'}
                                </button>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right: Details & Referral or KYC Form */}
                <div className="lg:col-span-8 space-y-8">
                    {showKYC ? (
                        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-3xl animate-in fade-in slide-in-from-right-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Verification Center</h3>
                                    <p className="text-indigo-100/40 text-sm mt-1">Complete your profile to unlock full features.</p>
                                </div>
                                <button onClick={() => setShowKYC(false)} className="h-10 w-10 rounded-full hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5">
                                    <ExternalLink className="w-5 h-5 rotate-45" />
                                </button>
                            </div>
                            <KYCForm onComplete={() => { setShowKYC(false); fetchUser(); }} />
                        </div>
                    ) : (
                        <>
                            <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                                    <User className="w-64 h-64" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    Personal Profile
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest ml-1">Full Identity Name</p>
                                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white font-medium">{user.name}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest ml-1">Registered Email</p>
                                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-white font-medium">{user.email}</div>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-[2.5rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-transparent p-10 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group">
                                    <Gift className="w-32 h-32 text-indigo-400 group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                <div className="max-w-md">
                                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Referral Program</h3>
                                    <p className="text-indigo-100/40 text-sm mb-8 leading-relaxed">
                                        Share your unique code with your network and earn exclusive rewards on every trade they execute.
                                    </p>
                                    
                                    <div className="relative group inline-block w-full">
                                        <div className="flex items-center justify-between p-3 pl-6 rounded-2xl bg-slate-950 border border-white/10 group-hover:border-indigo-500/50 transition-all duration-300">
                                            <div>
                                                <p className="text-[9px] text-indigo-400 uppercase font-black tracking-[0.2em] mb-1">Your Unique Invite Code</p>
                                                <p className="text-2xl font-mono font-bold text-white tracking-[0.3em]">{referralCode}</p>
                                            </div>
                                            <button 
                                                onClick={handleCopy}
                                                className="h-14 w-14 rounded-xl bg-indigo-600 flex items-center justify-center text-white transition-all hover:bg-white hover:text-indigo-600 active:scale-95 shadow-xl"
                                            >
                                                {copySuccess ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                                            </button>
                                        </div>
                                        {copySuccess && (
                                            <p className="absolute -top-7 right-0 text-xs font-bold text-emerald-400 animate-in fade-in slide-in-from-bottom-2">Copied to Clipboard!</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
