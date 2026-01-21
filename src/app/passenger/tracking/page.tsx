"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Phone, ShieldAlert, Share2, Star, Navigation, MapPin, User, Search, Hexagon, X, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Dynamic Map
import { adminService } from "@/lib/services/adminService"
import { UnifiedUser } from "@/lib/services/authService"

// Dynamic Map
const Map = dynamic(() => import("@/components/map/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-background animate-pulse" />
})

export default function RideTracking() {
    const router = useRouter()
    const [status, setStatus] = useState<'searching' | 'arriving' | 'started'>('searching')
    const [eta, setEta] = useState(3)
    const [searchStatusText, setSearchStatusText] = useState("Securing your ride...")
    const [assignedDriver, setAssignedDriver] = useState<UnifiedUser | null>(null)

    // Simulation: Matching with a real driver
    useEffect(() => {
        if (status === 'searching') {
            const timer = setTimeout(async () => {
                try {
                    const drivers = await adminService.getAllDrivers()
                    // NEW: Only match with drivers who are APPROVED AND ONLINE
                    const available = drivers.find(d => d.isApproved && d.availabilityStatus === 'online')

                    if (available) {
                        setAssignedDriver(available)
                        setEta(available.currentEta || 3)
                        setStatus('arriving')
                        console.log(`[SAFETY DISPATCH] SMS Sent: Your Smarth Partner ${available.name} is arriving in ${available.currentEta || 3} mins.`);
                    } else {
                        // Fallback logic for demo
                        const anyApproved = drivers.find(d => d.isApproved)
                        if (anyApproved) {
                            setAssignedDriver(anyApproved)
                            setEta(anyApproved.currentEta || 3)
                            setStatus('arriving')
                            console.log(`[DEMO DISPATCH] SMS Sent with first available driver: ${anyApproved.name}`);
                        }
                    }
                } catch (e) {
                    console.error("Match error:", e)
                }
            }, 5000) // 5 seconds of "searching"
            return () => clearTimeout(timer)
        }
    }, [status])

    // Rotating Text Effect
    useEffect(() => {
        if (status !== 'searching') return
        const texts = ["Securing your ride...", "Contacting Smarth Partners...", "Optimizing routes...", "Verifying safety metrics..."]
        let i = 0
        const interval = setInterval(() => {
            i = (i + 1) % texts.length
            setSearchStatusText(texts[i])
        }, 2200)
        return () => clearInterval(interval)
    }, [status])

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background font-sans select-none">

            {/* 1. INFINITE MAP BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <Map />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80 pointer-events-none" />
            </div>

            {/* Back Button (Floating) */}
            <div className="absolute top-12 left-6 z-50">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => router.back()}
                    className="h-12 w-12 bg-charcoal/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white shadow-premium"
                >
                    <X className="h-6 w-6" />
                </motion.button>
            </div>

            {/* 2. RADAR SEARCH INTERFACE */}
            <AnimatePresence mode="wait">
                {status === 'searching' && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 bg-background/20 backdrop-blur-[2px]"
                    >
                        {/* Premium Radar Visualization */}
                        <div className="relative h-80 w-80 flex items-center justify-center">
                            {[0, 1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 border border-primary/20 rounded-full"
                                    initial={{ scale: 0.4, opacity: 0 }}
                                    animate={{
                                        scale: [0.4, 1.4],
                                        opacity: [0.6, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.75,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}

                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-t-2 border-primary/40 rounded-full blur-[1px]"
                            />

                            <div className="h-32 w-32 bg-surface/80 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-center shadow-premium relative z-10">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="h-20 w-20 bg-primary rounded-full flex items-center justify-center shadow-glow"
                                >
                                    <Hexagon className="h-10 w-10 text-background fill-background/10 stroke-[1.5px]" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Status Hub */}
                        <div className="mt-12 text-center space-y-4 max-w-[300px]">
                            <motion.div
                                key={searchStatusText}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-10"
                            >
                                <h2 className="text-3xl font-black text-white italic tracking-tight">{searchStatusText}</h2>
                            </motion.div>
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Partners Scan</span>
                            </div>

                            <Button
                                variant="ghost"
                                className="mt-8 text-muted-foreground hover:text-white hover:bg-white/5 rounded-2xl border border-white/5"
                                onClick={() => router.back()}
                            >
                                Cancel Request
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Arriving/In-Progress Status (Top Floating) */}
            {status !== 'searching' && (
                <div className="relative z-10 p-6 pt-16">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="glass backdrop-blur-3xl border border-white/10 p-5 rounded-[2.5rem] flex items-center gap-5 shadow-premium"
                    >
                        <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-glow shrink-0 animate-pulse">
                            <Navigation className="h-7 w-7 text-background stroke-[2.5px]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                                {status === 'arriving' ? 'Pickup in progress' : 'Trip live'}
                            </p>
                            <h2 className="text-lg font-black text-white leading-tight">Driver is arriving in <span className="text-primary italic">{eta} mins</span></h2>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* 3. DRIVER DETAILS (Bottom Floating Sheet) */}
            {status !== 'searching' && (
                <div className="absolute inset-x-0 bottom-0 z-30 p-6">
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-background rounded-[3.5rem] shadow-premium border border-white/5 relative overflow-hidden"
                    >
                        {/* OTP Banner */}
                        <div className="bg-charcoal p-4 flex justify-between items-center border-b border-white/5">
                            <div className="pl-4">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Secure Ride OTP</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black text-primary tracking-[0.3em]">4921</span>
                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                </div>
                            </div>
                            <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black text-muted-foreground uppercase">Rate Locked</p>
                                <p className="text-sm font-black text-white">₹145.00</p>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="flex items-center gap-5">
                                <div className="h-20 w-20 rounded-[2rem] bg-charcoal border-2 border-primary/20 p-1 shrink-0 overflow-hidden shadow-glow">
                                    <div className="h-full w-full bg-surface rounded-[1.6rem] flex items-center justify-center text-muted-foreground overflow-hidden">
                                        {assignedDriver?.documents?.profilePhoto ? (
                                            <img src={assignedDriver.documents.profilePhoto.url} className="h-full w-full object-cover" alt="Driver" />
                                        ) : (
                                            <User className="h-10 w-10 opacity-30" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-black text-white tracking-tight italic">
                                            {assignedDriver?.name?.split(' ')[0] || 'Partner'} <span className="not-italic text-primary">{assignedDriver?.name?.split(' ')[1] || 'Found'}</span>
                                        </h2>
                                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                                            <Star className="h-3 w-3 text-primary fill-primary" />
                                            <span className="text-[10px] font-black text-primary">4.9</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
                                        {assignedDriver?.vehicleNumber || 'MH 12 XX 0000'} • Professional Partner
                                    </p>
                                </div>
                            </div>

                            {/* Actions Group */}
                            <div className="grid grid-cols-3 gap-4">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => assignedDriver?.phone && (window.location.href = `tel:${assignedDriver.phone}`)}
                                    className="flex flex-col items-center gap-2 py-5 rounded-[2rem] glass hover:bg-white/5 transition-all text-white"
                                >
                                    <Phone className="h-6 w-6" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Call</span>
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2 py-5 rounded-[2rem] glass hover:bg-white/5 transition-all text-white">
                                    <Share2 className="h-6 w-6" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Share</span>
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.95 }} className="flex flex-col items-center gap-2 py-5 rounded-[2rem] bg-alert/10 border border-alert/20 text-alert group">
                                    <ShieldAlert className="h-6 w-6 group-hover:animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Emergency</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
