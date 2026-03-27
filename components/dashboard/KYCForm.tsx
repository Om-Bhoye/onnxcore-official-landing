'use client';

import React, { useState, useEffect, useRef } from 'react';
import { auth, storage } from '@/lib/firebase';
import { 
    RecaptchaVerifier, 
    signInWithPhoneNumber, 
    ConfirmationResult 
} from 'firebase/auth';
import { 
    ref, 
    uploadBytesResumable, 
    getDownloadURL 
} from 'firebase/storage';
import { 
    Phone, 
    User, 
    Building, 
    Upload, 
    CheckCircle2, 
    AlertCircle,
    ChevronRight,
    ArrowLeft,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'phone' | 'type' | 'form' | 'success';
type KYCType = 'individual' | 'corporate';

interface FileUpload {
    file: File;
    label: string;
    progress: number;
    url?: string;
    storagePath?: string;
}

export default function KYCForm({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState<Step>('phone');
    const [kycType, setKycType] = useState<KYCType | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Step 1: Phone
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [phoneVerifiedAt, setPhoneVerifiedAt] = useState<Date | null>(null);
    const recaptchaRef = useRef<HTMLDivElement>(null);
    const [verifier, setVerifier] = useState<RecaptchaVerifier | null>(null);
    
    // Step 3: Form Data
    const [formData, setFormData] = useState<any>({});
    const [uploads, setUploads] = useState<Record<string, FileUpload>>({});

    const handleSendOtp = async () => {
        if (!phoneNumber) return;
        setLoading(true);
        try {
            let appVerifier = verifier;
            if (!appVerifier && recaptchaRef.current) {
                appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-dashboard', {
                    'size': 'invisible',
                });
                setVerifier(appVerifier);
            }
            if (!appVerifier) throw new Error('Recaptcha not initialized');
            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
        } catch (error: any) {
            console.error('OTP Error:', error);
            alert(error.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || !confirmationResult) return;
        setLoading(true);
        try {
            await confirmationResult.confirm(otp);
            setPhoneVerifiedAt(new Date());
            setStep('type');
        } catch (error) {
            alert('Invalid OTP code');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, label: string, key: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploads(prev => ({
            ...prev,
            [key]: { file, label, progress: 0 }
        }));
    };

    const uploadFiles = async (): Promise<boolean> => {
        const uploadPromises = Object.entries(uploads).map(async ([key, upload]) => {
            const firebaseUid = auth.currentUser?.uid;
            if (!firebaseUid) return;

            const extension = upload.file.name.split('.').pop();
            const filename = `${firebaseUid}_${key}.${extension}`;
            const path = `kyc/${firebaseUid}/${filename}`;
            const storageRef = ref(storage, path);
            
            const uploadTask = uploadBytesResumable(storageRef, upload.file);
            
            return new Promise<void>((resolve, reject) => {
                uploadTask.on('state_changed', 
                    (snapshot) => {
                        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploads(prev => ({
                            ...prev,
                            [key]: { ...prev[key], progress: prog }
                        }));
                    },
                    reject,
                    async () => {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        setUploads(prev => ({
                            ...prev,
                            [key]: { ...prev[key], url, storagePath: path }
                        }));
                        resolve();
                    }
                );
            });
        });

        try {
            await Promise.all(uploadPromises);
            return true;
        } catch (error) {
            console.error('Upload error:', error);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const uploadSuccess = await uploadFiles();
        if (!uploadSuccess) {
            setLoading(false);
            return alert('Error uploading documents');
        }

        // Re-gathering URLs manually from storage after all promises resolve (safest):
        const finalUploads = await Promise.all(Object.entries(uploads).map(async ([key, u]) => {
            const firebaseUid = auth.currentUser?.uid;
            const extension = u.file.name.split('.').pop();
            const path = `kyc/${firebaseUid}/${firebaseUid}_${key}.${extension}`;
            const url = await getDownloadURL(ref(storage, path));
            return {
                label: u.label,
                url,
                storagePath: path,
                mimeType: u.file.type,
                sizeBytes: u.file.size
            };
        }));

        const payload: any = {
            kycType,
            phoneNumber,
            phoneVerifiedAt: phoneVerifiedAt?.toISOString(),
            documents: finalUploads
        };

        if (kycType === 'individual') {
            payload.individualDetails = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                contactNumber: formData.contactNumber,
                idNumber: formData.idNumber,
            };
        } else {
            payload.corporateDetails = {
                companyName: formData.companyName,
                contactNumber: formData.contactNumber,
                taxIdNumber: formData.taxIdNumber,
            };
        }

        try {
            const res = await fetch('/api/kyc/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setStep('success');
                setTimeout(onComplete, 2000);
            } else {
                const err = await res.json();
                alert(err.error || 'Submission failed');
            }
        } catch (error) {
            alert('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div id="recaptcha-container-dashboard"></div>

            {step === 'phone' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-center mb-6">
                        <div className="h-16 w-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                            <Phone className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Phone Verification</h3>
                        <p className="text-indigo-100/40 text-sm">We'll send a secure code to verify your identity.</p>
                    </div>
                    
                    {!confirmationResult ? (
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5 ml-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="+1234567890"
                                    value={phoneNumber}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder-white/10 focus:border-indigo-500 focus:bg-white/[0.08] outline-none transition-all"
                                />
                            </div>
                            <button 
                                onClick={handleSendOtp}
                                disabled={loading || !phoneNumber}
                                className="w-full rounded-2xl bg-indigo-600 py-4.5 font-bold text-white hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 transition-all shadow-xl shadow-indigo-600/20"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Request Verification Code'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5 ml-1">Enter 6-Digit OTP</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white text-center text-3xl tracking-[0.5em] font-mono focus:border-indigo-500 focus:bg-white/[0.08] outline-none transition-all"
                                />
                            </div>
                            <button 
                                onClick={handleVerifyOtp}
                                disabled={loading || otp.length !== 6}
                                className="w-full rounded-2xl bg-indigo-600 py-4.5 font-bold text-white hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 transition-all font-sans tracking-normal shadow-xl shadow-indigo-600/20"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Verify Code & Proceed'}
                            </button>
                            <button onClick={() => setConfirmationResult(null)} className="w-full text-xs text-indigo-400/60 hover:text-indigo-400 transition-colors">Change phone number</button>
                        </div>
                    )}
                </div>
            )}

            {step === 'type' && (
                <div className="space-y-8 animate-in fade-in zoom-in-95">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Kyc Type</h3>
                        <p className="text-indigo-100/40 text-sm">Choose the category that best represents you.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <button
                            onClick={() => { setKycType('individual'); setStep('form'); }}
                            className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all text-left group flex flex-col items-center"
                        >
                            <div className="h-16 w-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-indigo-500/20">
                                <User className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h4 className="text-white font-bold mb-1">Individual</h4>
                            <p className="text-xs text-indigo-100/40 text-center">Freelancer or sole trader</p>
                        </button>
                        <button
                            onClick={() => { setKycType('corporate'); setStep('form'); }}
                            className="p-8 rounded-3xl border border-white/10 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10 transition-all text-left group flex flex-col items-center"
                        >
                            <div className="h-16 w-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-500/20">
                                <Building className="w-8 h-8 text-blue-400" />
                            </div>
                            <h4 className="text-white font-bold mb-1">Corporate</h4>
                            <p className="text-xs text-indigo-100/40 text-center">Registered company</p>
                        </button>
                    </div>
                </div>
            )}

            {step === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <div>
                            <h3 className="text-xl font-bold text-white">Identity Verification</h3>
                            <p className="text-xs text-indigo-100/40 mt-1 capitalize">{kycType} registration</p>
                        </div>
                        <button type="button" onClick={() => setStep('type')} className="text-xs font-bold text-indigo-400 flex items-center gap-2 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 active:scale-95">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {kycType === 'individual' ? (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest ml-1">First Name</label>
                                    <input required placeholder="Enter first name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-white/10" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest ml-1">Last Name</label>
                                    <input required placeholder="Enter last name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-white/10" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest ml-1">PAN / Aadhar Number</label>
                                    <input required placeholder="e.g. ABCDE1234F" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, idNumber: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-white/10" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest ml-1">Official Company Name</label>
                                    <input required placeholder="Enter registered company name" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, companyName: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-white/10" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest ml-1">Tax ID / GST Number</label>
                                    <input required placeholder="Enter tax identification" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, taxIdNumber: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-white/10" />
                                </div>
                            </>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-indigo-300/60 uppercase tracking-widest ml-1">Alternative Contact</label>
                            <input required placeholder="+1..." type="tel" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, contactNumber: e.target.value})} className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-white/10" />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest ml-1">Required Documentation</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {kycType === 'individual' ? (
                                <>
                                    <DocInput label="ID Front Side" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'ID Front', 'id_front')} progress={uploads['id_front']?.progress} fileName={uploads['id_front']?.file.name} />
                                    <DocInput label="ID Back Side" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'ID Back', 'id_back')} progress={uploads['id_back']?.progress} fileName={uploads['id_back']?.file.name} />
                                </>
                            ) : (
                                <>
                                    <DocInput label="Company Registration" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'GST Certificate', 'gst')} progress={uploads['gst']?.progress} fileName={uploads['gst']?.file.name} />
                                    <DocInput label="Entity PAN Card" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'PAN Card', 'pan')} progress={uploads['pan']?.progress} fileName={uploads['pan']?.file.name} />
                                </>
                            )}
                            <DocInput label="Facial Sync Video" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'Facial Video', 'facial_video')} progress={uploads['facial_video']?.progress} fileName={uploads['facial_video']?.file.name} isVideo />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-indigo-600 py-5 font-bold text-white hover:bg-indigo-500 active:scale-[0.99] transition-all disabled:opacity-50 shadow-xl shadow-indigo-600/30 text-lg"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Finish Verification'}
                    </button>
                </form>
            )}

            {step === 'success' && (
                <div className="text-center py-12 animate-in fade-in zoom-in-95">
                    <div className="h-24 w-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Submission Received</h3>
                    <p className="text-indigo-100/40 text-sm max-w-xs mx-auto">Your documents are now being reviewed by our compliance team.</p>
                </div>
            )}
        </div>
    );
}

function DocInput({ label, onChange, progress, fileName, isVideo }: any) {
    return (
        <div className="relative group">
            <label className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.02] cursor-pointer hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Upload className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-white truncate">{fileName || label}</p>
                    <p className="text-[10px] text-indigo-100/30 mt-0.5">{isVideo ? 'Video Upload (.mp4)' : 'Image or PDF'}</p>
                </div>
                <input type="file" className="hidden" onChange={onChange} />
            </label>
            {progress > 0 && progress < 100 && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            )}
        </div>
    );
}
