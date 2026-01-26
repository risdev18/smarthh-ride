"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Loader2, Car, UserCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { otpAuthService, UserRole } from '@/lib/services/otpAuthService';
import { useUserStore } from '@/lib/store/useUserStore';
import { useRouter } from 'next/navigation';

export default function OTPLoginScreen() {
    const router = useRouter();
    const { setUser } = useUserStore();

    const [role, setRole] = useState<UserRole>('passenger');
    const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOTP] = useState('');
    const [name, setName] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);

    // Admin login states
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [adminUsername, setAdminUsername] = useState('');
    const [adminPassword, setAdminPassword] = useState('');

    const handleSendOTP = async () => {
        if (phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        // Demo Backdoor mechanism
        if (phone === "9999999999") {
            setStep('otp');
            alert('Demo Mode: OTP sent!');
            return;
        }

        setLoading(true);
        try {
            await otpAuthService.sendOTP(phone);
            setStep('otp');
            alert('OTP sent to your phone!');
        } catch (error: any) {
            console.error(error);
            let errorMessage = error.message || 'Failed to send OTP';
            if (error.code === 'auth/quota-exceeded' || errorMessage.toLowerCase().includes('billing')) {
                errorMessage = "SMS Quota Exceeded. Please use the demo number (9999999999) for testing.";
            }
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            // Check if user exists
            const formattedPhone = `+91${phone}`;
            const existingUser = await otpAuthService.getUserByPhone(formattedPhone, role);

            if (existingUser) {
                // Existing user - verify OTP and login
                const user = await otpAuthService.verifyOTP(otp, role, existingUser.name);
                setUser({
                    id: user.id || '',
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                    vehicleNumber: user.vehicleNumber,
                    isApproved: user.isApproved,
                    status: (user.status as 'pending' | 'approved' | 'rejected' | 'incomplete' | 'offline' | 'online') || 'approved'
                });
                // Navigation will happen via useEffect in parent
            } else {
                // New user - ask for name
                setIsNewUser(true);
                setStep('name');
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteRegistration = async () => {
        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }

        if (role === 'driver' && !vehicleNumber.trim()) {
            alert('Please enter your vehicle number');
            return;
        }

        setLoading(true);
        try {
            const user = await otpAuthService.verifyOTP(otp, role, name, vehicleNumber);
            setUser({
                id: user.id || '',
                name: user.name,
                phone: user.phone,
                role: user.role,
                vehicleNumber: user.vehicleNumber,
                isApproved: user.isApproved,
                status: (user.status as 'pending' | 'approved' | 'rejected' | 'incomplete' | 'offline' | 'online') || (role === 'driver' ? 'incomplete' : 'approved')
            });
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Registration failed');
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
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 overflow-y-auto">
                <div id="recaptcha-container"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md space-y-6 my-10"
                >
                    <div className="text-center">
                        <ShieldCheck className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-black">Admin Login</h2>
                    </div>

                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-4">
                        <Input
                            placeholder="Admin Username"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            className="h-14 bg-slate-950/50 border-slate-800 rounded-2xl text-lg"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="h-14 bg-slate-950/50 border-slate-800 rounded-2xl text-lg"
                        />
                        <Button
                            onClick={handleAdminLogin}
                            disabled={loading}
                            className="w-full h-14 bg-yellow-500 text-black font-black text-lg rounded-2xl"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'LOGIN'}
                        </Button>
                        <button
                            onClick={() => setShowAdminLogin(false)}
                            className="w-full text-slate-400 text-sm hover:text-white"
                        >
                            Back to User Login
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-y-auto">
            {/* reCAPTCHA container */}
            <div id="recaptcha-container"></div>

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-40 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-md space-y-6 md:space-y-8 my-6"
            >
                {/* Logo */}
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-4 shadow-2xl"
                    >
                        <Car className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2">SmarthRides</h1>
                    <p className="text-slate-400 font-semibold">Aapla Shehar, Aapli Auto</p>
                </div>

                {/* Role Selection */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-2 flex gap-2">
                    {[
                        { id: 'passenger', label: 'Passenger', icon: UserCircle },
                        { id: 'driver', label: 'Driver', icon: Car }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setRole(tab.id as UserRole)}
                            className={`flex-1 relative flex items-center justify-center gap-2 py-4 rounded-2xl transition-all ${role === tab.id ? 'text-black' : 'text-slate-400'
                                }`}
                        >
                            {role === tab.id && (
                                <motion.div
                                    layoutId="activeRole"
                                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <tab.icon className="w-5 h-5 relative z-10" />
                            <span className="text-sm font-black uppercase relative z-10">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Auth Form */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Phone Number */}
                        {step === 'phone' && (
                            <motion.div
                                key="phone"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <h2 className="text-2xl font-black mb-2">Enter Phone Number</h2>
                                    <p className="text-slate-400 text-sm">We'll send you an OTP</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-slate-500" />
                                        <span className="text-slate-400 font-bold">+91</span>
                                    </div>
                                    <Input
                                        type="tel"
                                        placeholder="00000 00000"
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="h-16 bg-slate-950/50 border-slate-800 rounded-2xl pl-24 text-xl tracking-widest font-bold"
                                    />
                                </div>

                                <Button
                                    onClick={handleSendOTP}
                                    disabled={loading || phone.length !== 10}
                                    className="w-full h-14 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-lg rounded-2xl"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            SEND OTP <ArrowRight className="ml-2" />
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 'otp' && (
                            <motion.div
                                key="otp"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <h2 className="text-2xl font-black mb-2">Enter OTP</h2>
                                    <p className="text-slate-400 text-sm">Sent to +91 {phone}</p>
                                </div>

                                <Input
                                    type="tel"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value.replace(/\D/g, ''))}
                                    className="h-16 bg-slate-950/50 border-slate-800 rounded-2xl text-center text-2xl md:text-3xl tracking-[0.5em] md:tracking-[1em] font-bold px-2"
                                />

                                <Button
                                    onClick={handleVerifyOTP}
                                    disabled={loading || otp.length !== 6}
                                    className="w-full h-14 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-lg rounded-2xl"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'VERIFY OTP'}
                                </Button>

                                <button
                                    onClick={() => setStep('phone')}
                                    className="w-full text-slate-400 text-sm hover:text-white"
                                >
                                    Change Phone Number
                                </button>
                            </motion.div>
                        )}

                        {/* Step 3: Name (New Users Only) */}
                        {step === 'name' && (
                            <motion.div
                                key="name"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div>
                                    <h2 className="text-2xl font-black mb-2">Welcome! 🎉</h2>
                                    <p className="text-slate-400 text-sm">Let's set up your account</p>
                                </div>

                                <Input
                                    placeholder="Your Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-14 bg-slate-950/50 border-slate-800 rounded-2xl text-lg"
                                />

                                {role === 'driver' && (
                                    <Input
                                        placeholder="Vehicle Number (MH 12 AB 1234)"
                                        value={vehicleNumber}
                                        onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                                        className="h-14 bg-slate-950/50 border-slate-800 rounded-2xl text-lg uppercase"
                                    />
                                )}

                                <Button
                                    onClick={handleCompleteRegistration}
                                    disabled={loading || !name.trim()}
                                    className="w-full h-14 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-lg rounded-2xl"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'GET STARTED'}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Admin Login Link */}
                <button
                    onClick={() => setShowAdminLogin(true)}
                    className="w-full text-center text-slate-600 text-xs hover:text-slate-400"
                >
                    Admin Login
                </button>
            </motion.div>
        </div>
    );
}
