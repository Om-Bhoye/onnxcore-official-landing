'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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

type Step = 'phone' | 'type' | 'form' | 'success';
type KYCType = 'individual' | 'corporate';

interface UserInfo {
    id: string;
    name: string;
    email: string;
}

interface FileUpload {
    file: File;
    label: string;
    progress: number;
    url?: string;
    storagePath?: string;
    error?: string;
}

export default function KYCPage() {
    const router = useRouter();
    
    // State
    const [step, setStep] = useState<Step>('phone');
    const [kycType, setKycType] = useState<KYCType | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
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
    
    // Fetch User Info on Mount
    useEffect(() => {
        fetch('/api/user/me')
            .then(res => res.json())
            .then(data => {
                if (data.id) setUserInfo(data);
                else router.push('/login');
            })
            .catch(() => router.push('/login'));
    }, [router]);

    // --- Helper: Send OTP ---
    const handleSendOtp = async () => {
        if (!phoneNumber) return alert('Enter phone number');
        setLoading(true);
        try {
            // Initialize Recaptcha if not already done
            let appVerifier = verifier;
            if (!appVerifier && recaptchaRef.current) {
                appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                });
                setVerifier(appVerifier);
            }

            if (!appVerifier) throw new Error('Recaptcha not initialized');

            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
        } catch (error: any) {
            console.error('OTP Send Error:', error);
            if (error.code === 'auth/operation-not-allowed') {
                alert('CRITICAL: Phone authentication is not enabled in your Firebase Console. Please go to Authentication > Sign-in method and enable Phone.');
            } else if (error.code === 'auth/invalid-app-credential') {
                alert('Invalid app credential. Ensure your domain (e.g., localhost) is added to "Authorized Domains" in Firebase Console.');
            } else {
                alert(`Error: ${error.message || 'Failed to send OTP'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Helper: Verify OTP ---
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

    // --- Helper: File Selection & Validation ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, label: string, key: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Video Size Check (50MB)
        if (file.type.startsWith('video/') && file.size > 50 * 1024 * 1024) {
            alert('Videos must be less than 50MB');
            e.target.value = '';
            return;
        }

        setUploads(prev => ({
            ...prev,
            [key]: { file, label, progress: 0 }
        }));
    };

    // --- Helper: Upload All Files ---
    const uploadFiles = async (): Promise<boolean> => {
        if (!userInfo) return false;
        
        const uploadPromises = Object.entries(uploads).map(async ([key, upload]) => {
            const firebaseUid = auth.currentUser?.uid;
            if (!firebaseUid) throw new Error('Not authenticated with Firebase');

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
                    (error) => {
                        console.error('Upload error:', error);
                        reject(error);
                    },
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
        } catch (error: any) {
            console.error('Batch upload error:', error);
            if (error.code === 'storage/unauthorized') {
                alert('Storage upload failed: Permission denied. Please check your Firebase Storage security rules.');
            }
            return false;
        }
    };

    // --- Helper: Final Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Upload Files
        const uploadSuccess = await uploadFiles();
        if (!uploadSuccess) {
            setLoading(false);
            return alert('Error uploading documents. Please try again.');
        }

        // 2. Prepare Payload (get URLs from the updated uploads state via local map)
        // Note: state updates aren't immediate, so we need the refs from the successful uploadTask or re-fetch from storage if needed.
        // Better: Wait for state to reflect or use a local accumulator.
        
        // Re-gathering URLs manually from storage after all promises resolve (safest):
        const finalUploads = await Promise.all(Object.entries(uploads).map(async ([key, u]) => {
            const firebaseUid = auth.currentUser?.uid;
            const extension = u.file.name.split('.').pop();
            const path = `kyc/${firebaseUid}/${firebaseUid}_${key}.${extension}`;
            const url = await getDownloadURL(ref(storage, path));
            return {
                key,
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
            documents: finalUploads.map(f => ({
                label: f.label,
                url: f.url,
                storagePath: f.storagePath,
                mimeType: f.mimeType,
                sizeBytes: f.sizeBytes
            }))
        };

        if (kycType === 'individual') {
            payload.individualDetails = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                contactNumber: formData.contactNumber,
                idNumber: formData.idNumber,
                idFrontUrl: finalUploads.find(f => f.key === 'id_front')?.url,
                idBackUrl: finalUploads.find(f => f.key === 'id_back')?.url,
                facialVideoUrl: finalUploads.find(f => f.key === 'facial_video')?.url,
            };
        } else {
            payload.corporateDetails = {
                companyName: formData.companyName,
                contactNumber: formData.contactNumber,
                taxIdNumber: formData.taxIdNumber,
                gstCertificateUrl: finalUploads.find(f => f.key === 'gst')?.url,
                tradeLicenseUrl: finalUploads.find(f => f.key === 'trade')?.url,
                panCardUrl: finalUploads.find(f => f.key === 'pan')?.url,
                facialVideoUrl: finalUploads.find(f => f.key === 'facial_video')?.url,
            };
        }

        try {
            const res = await fetch('/api/kyc/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) setStep('success');
            else if (res.status === 401) {
                alert('Your session has expired. Please log in again to submit your KYC.');
                router.push('/login');
            } else {
                const err = await res.json();
                alert(err.error || 'Submission failed');
            }
        } catch {
            alert('Network error during submission');
        } finally {
            setLoading(false);
        }
    };

    // --- Sub-Component: Step Indicator ---
    const StepIndicator = () => (
        <div className="flex items-center justify-center space-x-4 mb-12">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                    <div className={`h-10 w-10 flex items-center justify-center rounded-full border-2 transition-all ${
                        (i === 1 && step === 'phone') || (i === 2 && step === 'type') || (i === 3 && step === 'form')
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                            : (i === 1 && (step !== 'phone')) || (i === 2 && step === 'form')
                            ? 'bg-indigo-600/20 border-indigo-600/50 text-indigo-300'
                            : 'bg-white/5 border-white/10 text-white/30'
                    }`}>
                        {i === 1 && (step !== 'phone' ? '✓' : '1')}
                        {i === 2 && (step === 'form' ? '✓' : '2')}
                        {i === 3 && '3'}
                    </div>
                    {i < 3 && <div className={`h-[2px] w-8 md:w-16 mx-2 ${
                        (i === 1 && step !== 'phone') || (i === 2 && step === 'form') ? 'bg-indigo-600/50' : 'bg-white/10'
                    }`} />}
                </div>
            ))}
        </div>
    );

    // --- Render Logic ---
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 font-sans overflow-hidden relative">
            <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
            <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
            
            <div id="recaptcha-container" ref={recaptchaRef}></div>

            <div className="relative z-10 w-full max-w-4xl">
                {step !== 'success' && <StepIndicator />}

                {/* --- STEP 1: Phone Verification --- */}
                {step === 'phone' && (
                    <div className="mx-auto max-w-xl rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-10 md:p-14 shadow-2xl backdrop-blur-3xl">
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Verify Identity</h1>
                            <p className="text-indigo-200/50">Verify your mobile number via OTP to continue</p>
                        </div>

                        {!confirmationResult ? (
                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-indigo-300/80 mb-2.5">Mobile Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+1234567890"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="block w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4.5 text-white placeholder-white/20 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                    />
                                </div>
                                <button 
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    className="w-full rounded-2xl bg-indigo-600 py-5 text-lg font-bold text-white shadow-2xl shadow-indigo-600/40 transition-all hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Sending...' : 'Send OTP Code'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-indigo-300/80 mb-2.5">Enter 6-digit OTP</label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="block w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4.5 text-white text-center text-2xl tracking-[1em] placeholder-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                                    />
                                </div>
                                <button 
                                    onClick={handleVerifyOtp}
                                    disabled={loading || otp.length !== 6}
                                    className="w-full rounded-2xl bg-indigo-600 py-5 text-lg font-bold text-white shadow-2xl shadow-indigo-600/40 transition-all hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                                <button onClick={() => setConfirmationResult(null)} className="w-full text-sm text-indigo-400/60 hover:text-indigo-400">Change number</button>
                            </div>
                        )}
                    </div>
                )}

                {/* --- STEP 2: KYC Type --- */}
                {step === 'type' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button
                            onClick={() => { setKycType('individual'); setStep('form'); }}
                            className="group relative flex flex-col items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-12 text-center transition-all hover:border-indigo-500/50 hover:bg-white/5 active:scale-95 shadow-2xl backdrop-blur-3xl"
                        >
                            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Individual</h2>
                            <p className="text-indigo-100/40 text-sm">Personal business or freelancer</p>
                        </button>

                        <button
                            onClick={() => { setKycType('corporate'); setStep('form'); }}
                            className="group relative flex flex-col items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-12 text-center transition-all hover:border-indigo-500/50 hover:bg-white/5 active:scale-95 shadow-2xl backdrop-blur-3xl"
                        >
                            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">
                                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-3h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">Corporate</h2>
                            <p className="text-indigo-100/40 text-sm">Registered company or enterprise</p>
                        </button>
                    </div>
                )}

                {/* --- STEP 3: Form & Upload --- */}
                {step === 'form' && (
                    <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-10 md:p-14 shadow-2xl backdrop-blur-3xl">
                        <div className="flex items-center justify-between mb-10">
                            <h1 className="text-3xl font-extrabold text-white">Verification Details</h1>
                            <button onClick={() => setStep('type')} className="text-sm text-indigo-400 hover:text-indigo-300">← Change Type</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {kycType === 'individual' ? (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-300/60 uppercase tracking-widest mb-2">First Name</label>
                                            <input required type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-300/60 uppercase tracking-widest mb-2">Last Name</label>
                                            <input required type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-300/60 uppercase tracking-widest mb-2">Contact No.</label>
                                            <input required type="tel" onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-300/60 uppercase tracking-widest mb-2">ID Number (PAN/Aadhar)</label>
                                            <input required type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, idNumber: e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-indigo-300/60 uppercase tracking-widest mb-2">Company Name</label>
                                            <input required type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, companyName: e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-300/60 uppercase tracking-widest mb-2">Business Contact</label>
                                            <input required type="tel" onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-300/60 uppercase tracking-widest mb-2">GST / PAN / Tax ID</label>
                                            <input required type="text" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, taxIdNumber: e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white focus:border-indigo-500 outline-none" />
                                        </div>
                                    </>
                                )}
                            </div>

                            <hr className="border-white/5" />

                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-white">Required Documents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {kycType === 'individual' ? (
                                        <>
                                            <DocUpload 
                                                label="ID Front Image" 
                                                id="id_front" 
                                                accept="image/*" 
                                                onChange={e => handleFileChange(e, 'ID Front', 'id_front')}
                                                progress={uploads['id_front']?.progress}
                                                file={uploads['id_front']?.file}
                                            />
                                            <DocUpload 
                                                label="ID Back Image" 
                                                id="id_back" 
                                                accept="image/*" 
                                                onChange={e => handleFileChange(e, 'ID Back', 'id_back')}
                                                progress={uploads['id_back']?.progress}
                                                file={uploads['id_back']?.file}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <DocUpload 
                                                label="GST/Trade License" 
                                                id="gst" 
                                                accept="image/*,application/pdf" 
                                                onChange={e => handleFileChange(e, 'GST Certificate', 'gst')}
                                                progress={uploads['gst']?.progress}
                                                file={uploads['gst']?.file}
                                            />
                                            <DocUpload 
                                                label="PAN Card" 
                                                id="pan" 
                                                accept="image/*,application/pdf" 
                                                onChange={e => handleFileChange(e, 'PAN Card', 'pan')}
                                                progress={uploads['pan']?.progress}
                                                file={uploads['pan']?.file}
                                            />
                                        </>
                                    )}
                                    <DocUpload 
                                        label="Facial Video (max 50MB)" 
                                        id="facial_video" 
                                        accept="video/*" 
                                        onChange={e => handleFileChange(e, 'Facial Video', 'facial_video')}
                                        progress={uploads['facial_video']?.progress}
                                        file={uploads['facial_video']?.file}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || (kycType === 'individual' ? (!uploads['id_front'] || !uploads['id_back'] || !uploads['facial_video']) : (!uploads['gst'] || !uploads['pan'] || !uploads['facial_video']))}
                                className="w-full flex items-center justify-center rounded-2xl bg-indigo-600 py-5 text-xl font-bold text-white shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Uploading & Submitting...' : 'Submit Verification'}
                            </button>
                        </form>
                    </div>
                )}

                {/* --- STEP 4: Success --- */}
                {step === 'success' && (
                    <div className="mx-auto max-w-md rounded-3xl border border-indigo-500/20 bg-white/5 p-10 text-center backdrop-blur-3xl">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-white">KYC Submitted</h1>
                        <p className="mt-4 text-indigo-100/60 leading-relaxed">
                            Thank you! Your verification is now pending. We'll notify you once our team reviews your documents.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="mt-10 w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Internal Helper: Doc Upload UI ---
function DocUpload({ label, id, onChange, progress, file, accept }: { label: string, id: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, progress?: number, file?: File, accept: string }) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/[0.08]">
            {progress && progress > 0 && progress < 100 && (
                <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
            )}
            <label htmlFor={id} className="cursor-pointer">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">{file ? file.name : label}</p>
                        <p className="text-xs text-indigo-300/40">{file ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Select file'}</p>
                    </div>
                </div>
                <input id={id} type="file" required accept={accept} className="hidden" onChange={onChange} />
            </label>
        </div>
    );
}

declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}

