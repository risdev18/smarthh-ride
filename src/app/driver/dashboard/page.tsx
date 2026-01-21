"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDriverStore } from "@/lib/store/useDriverStore"
import { useUserStore } from "@/lib/store/useUserStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Power, MapPin, Navigation, IndianRupee, AlertTriangle, Clock, Map as MapIcon, Phone, MessageCircle, Flag, CheckCircle, ShieldCheck, Star, Hexagon, Gauge, Loader2, Home, Info, LogOut, ArrowRight, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { driverService } from "@/lib/services/driverService"

// Dynamic Map
const Map = dynamic(() => import("@/components/map/MapComponent"), { ssr: false })

export default function DriverDashboard() {
    const router = useRouter()
    const { user, logout: logoutUser } = useUserStore()
    const { status, setStatus, rideStatus, setRideStatus } = useDriverStore()
    const [eta, setEta] = useState(3)
    const [isUpdating, setIsUpdating] = useState(false)

    // Sync Firestore Availability
    const toggleAvailability = async (newStatus: 'online' | 'offline') => {
        if (!user?.id) return
        setIsUpdating(true)
        try {
            await driverService.updateAvailability(user.id, newStatus)
            setStatus(newStatus)
        } catch (e) {
            alert("Failed to update status")
        } finally {
            setIsUpdating(false)
        }
    }

    // Update ETA to reaching pickup
    const handleEtaChange = async (newEta: number) => {
        if (!user?.id) return
        setEta(newEta)
        try {
            await driverService.updateEta(user.id, newEta)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (!user || user.role !== 'driver') {
            router.push("/")
        }
    }, [user, router])

    const verification = user?.isApproved ? 'approved' : 'incomplete'

    // Local state for OTP Input
    const [otpInput, setOtpInput] = useState(["", "", "", ""])
    const [otpError, setOtpError] = useState(false)

    // Verify OTP Logic
    const handleVerifyOtp = () => {
        const enteredOtp = otpInput.join("")
        if (enteredOtp === "4921") {
            setRideStatus('in_progress')
        } else {
            setOtpError(true)
            setTimeout(() => setOtpError(false), 2000)
        }
    }

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return
        const newOtp = [...otpInput]
        newOtp[index] = value
        setOtpInput(newOtp)

        // Auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const [earnings] = useState({ today: 845, rides: 12 })
    const [showHub, setShowHub] = useState(false)

    if (verification === 'incomplete') {
        const vStatus = user?.verificationStatus || 'pending'

        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background relative overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${vStatus === 'rejected' ? 'bg-alert/10' : 'bg-primary/10'} rounded-full blur-[100px]`} />
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="z-10 w-full max-w-sm space-y-12"
                >
                    <div className="space-y-6">
                        <div className="relative inline-block">
                            {vStatus === 'rejected' ? (
                                <div className="h-28 w-28 bg-alert rounded-[2.5rem] flex items-center justify-center shadow-xl rotate-12">
                                    <AlertTriangle className="h-14 w-14 text-white" />
                                </div>
                            ) : (
                                <div className="h-28 w-28 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-xl -rotate-12">
                                    <Clock className="h-14 w-14 text-background font-black" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-black text-white italic tracking-tight">
                                {vStatus === 'rejected' ? "Verification " : "Profile "}
                                <span className={vStatus === 'rejected' ? 'text-alert' : 'text-primary'}>
                                    {vStatus === 'rejected' ? "Rejected" : "Pending"}
                                </span>
                            </h1>
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                                {vStatus === 'rejected'
                                    ? "Your documents did not meet our safety standards. Please re-upload verified copies."
                                    : "Our safety team is currently reviewing your Samarth partner credentials."}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface/50 border border-white/5 rounded-[2.5rem] p-8 space-y-6 backdrop-blur-3xl shadow-premium">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-left">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                                    <ShieldCheck className={`h-5 w-5 ${vStatus === 'rejected' ? 'text-alert' : 'text-primary'}`} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Document Status</p>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">{vStatus === 'rejected' ? "Action Required" : "Awaiting Audit"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button
                                variant="premium"
                                className="h-18 w-full rounded-2xl text-lg font-black italic shadow-glow"
                                onClick={() => window.location.href = '/driver/register'}
                            >
                                {vStatus === 'rejected' ? "RE-UPLOAD DOCUMENTS" : "CHECK REQUIREMENTS"}
                            </Button>

                            <Button
                                variant="ghost"
                                className="h-14 w-full rounded-2xl opacity-60 hover:opacity-100 font-black text-[10px] uppercase tracking-widest"
                                onClick={async () => {
                                    await logoutUser();
                                    window.location.href = '/';
                                }}
                            >
                                EXIT TO HOME
                            </Button>
                        </div>
                    </div>

                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40 leading-relaxed">
                        Security Verification v1.0 <br /> Samarth Ride - Vishwasacha Pravas
                    </p>
                </motion.div>
            </div>
        )
    }

    const hubItems = [
        { name: "Settings", icon: Home, path: "/settings", color: "text-blue-500" },
        { name: "Support", icon: ShieldCheck, path: "/support", color: "text-primary" },
        { name: "About", icon: Info, path: "/about", color: "text-orange-500" },
        { name: "Sign Out", icon: LogOut, path: "logout", color: "text-alert" }
    ]

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background font-sans select-none">

            {/* Hub Overlay Menu */}
            <AnimatePresence>
                {showHub && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] bg-background/95 backdrop-blur-3xl p-8 flex flex-col justify-between"
                    >
                        <div className="space-y-12">
                            <div className="flex justify-between items-center">
                                <h2 className="text-4xl font-black italic">Partner <span className="text-primary">Hub</span></h2>
                                <Button variant="ghost" size="icon" className="rounded-full bg-white/5" onClick={() => setShowHub(false)}>
                                    <ArrowRight className="h-6 w-6 rotate-180" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {hubItems.map((item) => (
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        key={item.name}
                                        onClick={() => {
                                            if (item.path === 'logout') {
                                                logoutUser()
                                                router.push("/")
                                            } else {
                                                router.push(item.path)
                                            }
                                        }}
                                        className="h-20 w-full bg-surface border border-white/5 rounded-3xl px-6 flex items-center gap-6 group hover:border-primary/20 transition-all"
                                    >
                                        <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color}`}>
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <span className="text-lg font-black uppercase tracking-widest">{item.name}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="text-center space-y-2 opacity-50">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Samarth Partner Network v1.0</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-2">Samarth Ride - Vishwasacha Pravas</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hub Trigger Button */}
            <div className="absolute top-6 left-6 z-50">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowHub(true)}
                    className="h-12 w-12 glass rounded-2xl flex items-center justify-center text-white border border-white/10"
                >
                    <User className="h-5 w-5" />
                </motion.button>
            </div>

            {/* 1. MAP BACKGROUND (Active when online) */}
            <div className="absolute inset-0 z-0">
                <Map showUserLocation={status === 'online'} />
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/90 pointer-events-none" />
            </div>

            {/* 2. OFFLINE STATE OVERLAY */}
            <AnimatePresence>
                {status === 'offline' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="space-y-12 w-full max-w-sm">
                            <div className="space-y-2">
                                <h1 className="text-5xl font-black text-white italic tracking-tighter opacity-20">OFFLINE</h1>
                                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Ready to start your shift?</p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleAvailability('online')}
                                disabled={isUpdating}
                                className="h-64 w-64 rounded-[4rem] bg-charcoal border-4 border-white/5 shadow-premium flex flex-col items-center justify-center gap-4 group transition-all disabled:opacity-50"
                            >
                                <div className="h-24 w-24 bg-surface rounded-3xl flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:shadow-glow transition-all">
                                    {isUpdating ? <Loader2 className="animate-spin h-10 w-10" /> : <Power className="h-12 w-12" />}
                                </div>
                                <span className="text-lg font-black text-muted-foreground group-hover:text-white uppercase tracking-[0.2em] transition-all">Go Online</span>
                            </motion.button>

                            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Last Shift</p>
                                    <p className="text-3xl font-black text-white leading-none">₹{earnings.today}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Rides Done</p>
                                    <p className="text-3xl font-black text-white leading-none">{earnings.rides}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {status === 'online' && (
                <div className="relative z-20 p-6 flex flex-col gap-6 pt-12">
                    <div className="flex justify-between items-start">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-background/80 backdrop-blur-3xl rounded-[2.5rem] p-5 pr-8 border border-white/10 shadow-premium flex items-center gap-4"
                        >
                            <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-glow shrink-0">
                                <IndianRupee className="h-7 w-7 text-background stroke-[2.5px]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Today's Wallet</p>
                                <h2 className="text-2xl font-black text-white tracking-tighter">₹{earnings.today}</h2>
                            </div>
                        </motion.div>

                        <div className="flex flex-col gap-3">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleAvailability('offline')}
                                disabled={isUpdating}
                                className="h-16 w-16 bg-alert border-4 border-background rounded-[1.5rem] flex items-center justify-center text-white shadow-xl"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" /> : <Power className="h-7 w-7" />}
                            </motion.button>

                            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-2 px-3 text-center">
                                <p className="text-[8px] font-black text-primary uppercase leading-tight">Status</p>
                                <p className="text-[10px] font-black text-white italic">ACTIVE</p>
                            </div>
                        </div>
                    </div>

                    {/* ETA SLIDER (Only when idle) */}
                    {rideStatus === 'idle' && (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-charcoal/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 space-y-4"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-white/5 rounded-lg flex items-center justify-center">
                                        <Gauge className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Arrival Settings</span>
                                </div>
                                <span className="text-lg font-black text-primary italic">{eta} MINS</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={eta}
                                onChange={(e) => handleEtaChange(parseInt(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-tighter opacity-50">Adjust how long you need to reach pickups</p>
                        </motion.div>
                    )}
                </div>
            )}

            {/* 4. RIDE FLOW SHEETS */}
            <AnimatePresence>
                {status === 'online' && (
                    <div className="absolute inset-x-0 bottom-0 z-30 p-6">

                        {/* IDLE STATE - SCANNING */}
                        {rideStatus === 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center mb-8"
                            >
                                <div className="relative h-40 w-40 flex items-center justify-center">
                                    {[0, 1].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                                            transition={{ repeat: Infinity, duration: 2, delay: i }}
                                            className="absolute inset-0 border-2 border-primary/40 rounded-full"
                                        />
                                    ))}
                                    <div className="h-20 w-20 bg-primary/20 backdrop-blur-xl rounded-full flex items-center justify-center">
                                        <Navigation className="h-10 w-10 text-primary animate-pulse" />
                                    </div>
                                </div>
                                <p className="text-sm font-black text-primary uppercase tracking-[0.3em] mt-4 animate-pulse italic">Scanning for local rides...</p>
                            </motion.div>
                        )}

                        {/* NAVIGATING TO PICKUP */}
                        {rideStatus === 'navigating' && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-background rounded-[3.5rem] p-8 border border-white/5 shadow-premium space-y-8"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Target Pickup</p>
                                        <h2 className="text-2xl font-black text-white italic tracking-tight leading-tight">Hanuman Mandir</h2>
                                        <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> 2.4 km away • 4 mins
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <motion.button whileTap={{ scale: 0.9 }} className="h-14 w-14 bg-charcoal rounded-2xl flex items-center justify-center text-white border border-white/5"><Phone className="h-6 w-6" /></motion.button>
                                        <motion.button whileTap={{ scale: 0.9 }} className="h-14 w-14 bg-charcoal rounded-2xl flex items-center justify-center text-white border border-white/5"><MessageCircle className="h-6 w-6" /></motion.button>
                                    </div>
                                </div>

                                <Button
                                    variant="premium"
                                    className="w-full h-20 text-2xl font-black rounded-3xl shadow-glow active:scale-[0.98]"
                                    onClick={() => setRideStatus('arrived')}
                                >
                                    I HAVE ARRIVED
                                </Button>
                            </motion.div>
                        )}

                        {/* OTP VERIFICATION */}
                        {rideStatus === 'arrived' && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-background rounded-[3.5rem] p-10 border border-white/5 shadow-premium space-y-10"
                            >
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-black text-white italic uppercase tracking-wider">Secure <span className="text-primary not-italic">Start</span></h2>
                                    <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Verify passenger's 4-digit code</p>
                                </div>

                                <div className="flex justify-center gap-4">
                                    {otpInput.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="number"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            className={`w-16 h-20 text-center text-4xl font-black bg-charcoal border-2 rounded-2xl outline-none transition-all text-white ${otpError ? 'border-alert/50 text-alert' : 'border-white/5 focus:border-primary focus:shadow-glow'}`}
                                            placeholder="•"
                                        />
                                    ))}
                                </div>

                                <Button
                                    className="w-full h-20 text-2xl font-black bg-white text-background hover:bg-zinc-200 rounded-3xl"
                                    onClick={handleVerifyOtp}
                                    disabled={otpInput.join("").length < 4}
                                >
                                    BEGIN JOURNEY
                                </Button>
                            </motion.div>
                        )}

                        {/* RIDE IN PROGRESS */}
                        {rideStatus === 'in_progress' && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-background rounded-[3.5rem] p-8 border border-white/5 shadow-premium space-y-8"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="h-20 w-20 bg-green-500/10 border-2 border-green-500/20 rounded-[2rem] flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                                        <MapIcon className="h-10 w-10 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">In Transit</p>
                                        <h2 className="text-2xl font-black text-white leading-tight">Shivaji Nagar Station</h2>
                                        <p className="text-xs font-bold text-muted-foreground">Dropping Off Passenger</p>
                                    </div>
                                </div>

                                <div className="bg-charcoal/50 p-6 rounded-[2rem] flex justify-between items-center border border-white/5">
                                    <span className="text-muted-foreground font-black text-xs uppercase tracking-widest">Fare to collect</span>
                                    <span className="text-3xl font-black text-white tracking-tighter">₹145.00</span>
                                </div>

                                <Button
                                    className="w-full h-20 text-2xl font-black bg-alert/20 text-alert border border-alert/30 hover:bg-alert/30 rounded-3xl"
                                    onClick={() => setRideStatus('completed')}
                                >
                                    COMPLETE RIDE
                                </Button>
                            </motion.div>
                        )}
                    </div>
                )}
            </AnimatePresence>

            {/* 5. PAYMENT COLLECTION (FULL SCREEN) */}
            <AnimatePresence>
                {rideStatus === 'completed' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8 text-center space-y-12"
                    >
                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="h-40 w-40 bg-green-500/20 rounded-full flex items-center justify-center relative z-10"
                            >
                                <CheckCircle className="h-24 w-24 text-green-500" />
                            </motion.div>
                            <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">Mission <span className="text-green-500 not-italic">Complete</span></h2>
                            <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">Collect cash payment now</p>
                        </div>

                        <div className="bg-charcoal p-10 rounded-[4rem] w-full max-w-sm border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
                            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Total Earning</p>
                            <h1 className="text-7xl font-black text-white tracking-tighter flex items-center justify-center gap-2">
                                <span className="text-3xl font-bold text-zinc-600">₹</span>145
                            </h1>
                        </div>

                        <Button
                            variant="premium"
                            className="w-full max-w-sm h-24 text-3xl font-black rounded-[2.5rem] shadow-glow"
                            onClick={() => {
                                setRideStatus('idle')
                                setStatus('online')
                            }}
                        >
                            PAYMENT RECEIVED
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mock Trigger Listener */}
            <MockRequestTrigger active={status === 'online' && rideStatus === 'idle'} onTrigger={() => setRideStatus('request')} />

        </div>
    )
}

function MockRequestTrigger({ active, onTrigger }: { active: boolean, onTrigger: () => void }) {
    useEffect(() => {
        if (!active) return
        const timer = setTimeout(onTrigger, 5000)
        return () => clearTimeout(timer)
    }, [active, onTrigger])
    return null
}
