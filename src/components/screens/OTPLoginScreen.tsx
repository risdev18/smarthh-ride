"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Car, UserCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { otpAuthService, UserRole } from '@/lib/services/otpAuthService';
import { useUserStore } from '@/lib/store/useUserStore';
import { useRouter } from 'next/navigation';

export default function OTPLoginScreen() {
    const router = useRouter();
    const { setUser } = useUserStore();

    const [role, setRole] = useState<UserRole>('passenger');
    const [loading, setLoading] = useState(false);

    // Admin login states
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const user = await otpAuthService.signInWithGoogle(role);
            setUser({
                id: user.id || '',
                name: user.name,
                phone: user.phone || '',
                role: user.role,
                vehicleNumber: user.vehicleNumber,
                isApproved: user.isApproved,
                status: (user.status as 'pending' | 'approved' | 'rejected' | 'incomplete' | 'offline' | 'online') || 'approved'
            });
        } catch (error: any) {
            console.error("Google Login Error:", error);
            alert(error.message || 'Google Login Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLogin = async () => {
        setLoading(true);
        try {
            const user = await otpAuthService.adminLogin(adminUsername, adminPassword);
            if (user) {
                setUser({
                    id: user.id || '',
                    name: user.name,
                    phone: user.phone,
                    role: user.role
                });
            } else {
                alert('Invalid admin credentials');
            }
        } catch (error: any) {
            alert('Admin login failed');
        } finally {
            setLoading(false);
        }
    };

    // Admin Login UI
    if (showAdminLogin) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[400px] space-y-6 sm:space-y-8 my-auto"
                >
                    <div className="text-center space-y-2">
                        <div className="h-16 w-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-1 ring-yellow-500/20">
                            <ShieldCheck className="w-10 h-10 text-yellow-500" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight">Admin Portal</h2>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Secure Access Only</p>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-6 sm:p-10 space-y-4 shadow-2xl">
                        <div className="space-y-3">
                            <Input
                                placeholder="Admin Username"
                                value={adminUsername}
                                onChange={(e) => setAdminUsername(e.target.value)}
                                className="h-14 bg-slate-950 border-white/5 rounded-2xl text-base px-6 focus:border-yellow-500/50 transition-all"
                            />
                            <Input
                                type="password"
                                placeholder="Security Password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="h-14 bg-slate-950 border-white/5 rounded-2xl text-base px-6 focus:border-yellow-500/50 transition-all"
                            />
                        </div>
                        <Button
                            onClick={handleAdminLogin}
                            disabled={loading}
                            className="w-full h-14 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-lg rounded-2xl shadow-lg shadow-yellow-500/20 transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'AUTHORIZE ACCESS'}
                        </Button>
                        <button
                            onClick={() => setShowAdminLogin(false)}
                            className="w-full py-2 text-slate-500 text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
                        >
                            Return to Fleet Login
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-slate-950 text-white flex flex-col items-center justify-center p-5 sm:p-8 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-[420px] flex flex-col space-y-8 sm:space-y-10"
            >
                {/* Branding Section */}
                <div className="text-center space-y-4 sm:space-y-6">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-[2rem] rotate-6 opacity-20 blur-sm"></div>
                        <div className="relative h-full w-full bg-gradient-to-br from-yellow-400 to-orange-600 rounded-[2rem] flex items-center justify-center shadow-2xl">
                            <Car className="w-10 h-10 sm:w-12 sm:h-12 text-black" strokeWidth={2.5} />
                        </div>
                    </motion.div>

                    <div className="space-y-1 sm:space-y-2">
                        <h1 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none">
                            Smarth<span className="text-primary">Rides</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs">Aapla Shehar, Aapli Auto</p>
                    </div>
                </div>

                {/* Main Auth Container */}
                <div className="space-y-6">
                    {/* Role Toggles */}
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 p-1.5 rounded-[1.8rem] flex shadow-2xl">
                        {[
                            { id: 'passenger', label: 'Passenger', icon: UserCircle },
                            { id: 'driver', label: 'Driver', icon: Car }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setRole(tab.id as UserRole)}
                                className={`flex-1 relative flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-2xl transition-all duration-300 ${role === tab.id ? 'text-black font-black' : 'text-slate-500 font-bold'
                                    }`}
                            >
                                {role === tab.id && (
                                    <motion.div
                                        layoutId="activeRoleHighlight"
                                        className="absolute inset-0 bg-primary rounded-2xl shadow-lg shadow-primary/20"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <tab.icon className={`w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-colors ${role === tab.id ? 'text-black' : 'text-slate-500'}`} />
                                <span className="text-[10px] sm:text-xs uppercase tracking-widest relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Action Card */}
                    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden group">
                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl sm:text-3xl font-black italic tracking-tight">Ready to Roll?</h2>
                            <p className="text-slate-500 font-medium text-xs sm:text-sm">Instant access to your local transit network.</p>
                        </div>

                        <Button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full h-16 bg-white hover:bg-slate-100 text-black font-black text-lg sm:text-xl rounded-2xl flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google Sign In
                                </>
                            )}
                        </Button>

                        <div className="space-y-4">
                            <p className="text-[10px] text-slate-600 text-center font-bold uppercase tracking-widest leading-relaxed">
                                By joining, you accept our <span className="text-slate-400">Terms</span> & <span className="text-slate-400">Security Protocols</span>
                            </p>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

                            <button
                                onClick={() => setShowAdminLogin(true)}
                                className="w-full text-center text-slate-700 text-[10px] font-black uppercase tracking-[0.3em] hover:text-yellow-500/50 transition-colors"
                            >
                                Dispatcher Access
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Minimal Footer */}
            <div className="absolute bottom-6 sm:bottom-10 left-0 w-full text-center pointer-events-none">
                <p className="text-[9px] sm:text-[10px] text-slate-700 font-bold uppercase tracking-[0.4em] opacity-50">
                    Proprietary Network • India 2026
                </p>
            </div>
        </div>
    );
}
