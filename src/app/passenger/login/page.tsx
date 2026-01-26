"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Lock, ArrowRight, MapPin, Phone, ShieldCheck } from "lucide-react"
import { useUserStore } from "@/lib/store/useUserStore"
import { authService } from "@/lib/services/authService"
import { motion, AnimatePresence } from "framer-motion"

export default function PassengerLogin() {
    const router = useRouter()
    const { setUser } = useUserStore()

    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [step, setStep] = useState<'phone' | 'password'>('phone')
    const [loading, setLoading] = useState(false)

    const handleContinue = async () => {
        if (phone.length !== 10) return
        setLoading(true)
        // Simulate phone check
        setTimeout(() => {
            setLoading(false)
            setStep('password')
        }, 800)
    }

    const handleLogin = async () => {
        if (!password) return
        setLoading(true)
        try {
            const user = await authService.login("+91 " + phone, password)
            if (user) {
                setUser({
                    id: user.id || "unknown",
                    name: user.name,
                    phone: user.phone,
                    role: 'passenger',
                    isApproved: true
                })
                router.push("/passenger")
            } else {
                alert("Incorrect PIN/Password. Please try again.")
            }
        } catch (e) {
            alert("Login failed. Check your connection.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-white p-8 flex flex-col justify-between font-sans">
            <div className="space-y-12 mt-12">
                <header className="space-y-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center shadow-glow"
                    >
                        <MapPin className="h-8 w-8 text-background stroke-[3px]" />
                    </motion.div>
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tighter">SMARTH <span className="text-primary not-italic">RIDE</span></h1>
                        <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] mt-1">Vishwasacha Pravas v1.0</p>
                    </div>
                </header>

                <div className="space-y-8">
                    <AnimatePresence mode="wait">
                        {step === 'phone' ? (
                            <motion.div
                                key="phone"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-black italic tracking-tight">Enter your <span className="text-primary">Mobile</span></h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Login or create a new account via phone</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-16 w-20 flex items-center justify-center bg-surface border border-white/5 rounded-2xl font-black text-white/40 italic">
                                        +91
                                    </div>
                                    <Input
                                        type="tel"
                                        placeholder="98765 43210"
                                        className="flex-1 h-16 bg-surface border-white/5 focus:border-primary/50 text-2xl font-black tracking-[0.2em] placeholder:text-white/10 rounded-2xl transition-all"
                                        maxLength={10}
                                        value={phone}
                                        autoFocus
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>
                                <Button
                                    className="w-full h-18 text-xl font-black rounded-2xl shadow-glow"
                                    variant="premium"
                                    onClick={handleContinue}
                                    disabled={phone.length !== 10 || loading}
                                >
                                    {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "CONTINUE REQUEST"}
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="password"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-black italic tracking-tight">Secure <span className="text-primary">Login</span></h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Enter your 4-digit PIN or unique password</p>
                                </div>
                                <div className="relative">
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-18 bg-surface border-white/5 focus:border-primary/50 text-3xl font-black tracking-[0.5em] placeholder:text-white/10 rounded-2xl transition-all pl-16"
                                        value={password}
                                        autoFocus
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                                </div>
                                <div className="flex gap-4">
                                    <Button
                                        className="h-18 w-20 bg-white/5 border border-white/5 rounded-2xl"
                                        onClick={() => setStep('phone')}
                                    >
                                        <ArrowRight className="h-6 w-6 rotate-180" />
                                    </Button>
                                    <Button
                                        className="flex-1 h-18 text-xl font-black rounded-2xl shadow-glow"
                                        variant="premium"
                                        onClick={handleLogin}
                                        disabled={!password || loading}
                                    >
                                        {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "VERIFY IDENTITY"}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="space-y-6 pb-8">
                <div className="text-center">
                    <button
                        onClick={() => router.push("/passenger/register")}
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                    >
                        New to Smarth? <span className="text-white underline ml-2">Register Hub</span>
                    </button>
                </div>

                <div className="h-[1px] bg-white/5 w-full" />

                <div className="flex justify-center">
                    <button
                        onClick={() => router.push("/")}
                        className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Switch Role • Driver / Admin
                    </button>
                </div>
            </div>
        </div>
    )
}
