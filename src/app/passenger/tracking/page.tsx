"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Phone, ShieldAlert, Share2, Star, Navigation, MapPin, User, Search, Hexagon, X, ShieldCheck, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "@firebase/firestore"
import { rideService } from "@/lib/services/rideService"

// Dynamic Map
const Map = dynamic(() => import("@/components/map/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-background animate-pulse" />
})

export default function RideTracking() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const rideId = searchParams.get('rideId')

    const [status, setStatus] = useState<'searching' | 'arriving' | 'started' | 'completed' | 'cancelled'>('searching')
    const [eta, setEta] = useState(3)
    const [searchStatusText, setSearchStatusText] = useState("Securing your ride...")
    const [assignedDriver, setAssignedDriver] = useState<any>(null)
    const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null)
    const [rideData, setRideData] = useState<any>(null)

    // Listen to Ride Document for Real-time status
    useEffect(() => {
        if (!rideId) return

        const rideRef = doc(db, "rides", rideId)
        const unsubscribe = onSnapshot(rideRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data()
                setRideData(data)

                // Map Firestore status to local UI status
                if (data.status === 'pending') setStatus('searching')
                else if (data.status === 'accepted' || data.status === 'arrived') setStatus('arriving')
                else if (data.status === 'in_progress') setStatus('started')
                else if (data.status === 'completed') {
                    setStatus('completed')
                    router.push(`/passenger/payment?fare=${data.fare}&driver=${data.driverName || 'Partner'}`)
                }
                else if (data.status === 'cancelled') {
                    setStatus('cancelled')
                    alert("This ride was cancelled.")
                    router.push('/passenger')
                }

                // If driver assigned, get driver details
                if (data.driverId && (!assignedDriver || assignedDriver.id !== data.driverId)) {
                    fetchDriverDetails(data.driverId)
                }
            }
        })

        return () => unsubscribe()
    }, [rideId])

    const fetchDriverDetails = async (driverId: string) => {
        const driverRef = doc(db, "users", driverId)
        onSnapshot(driverRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data()
                setAssignedDriver({ id: docSnap.id, ...data })
                if (data.currentLocation) setDriverLocation(data.currentLocation)
                if (data.currentEta) setEta(data.currentEta)
            }
        })
    }

    const handleCancelRequest = async () => {
        if (!rideId) return
        try {
            await rideService.cancelRide(rideId, "Passenger cancelled")
            router.push('/passenger')
        } catch (error) {
            console.error(error)
            router.push('/passenger')
        }
    }

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

    if (!rideId) return (
        <div className="h-screen w-full bg-background flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="h-16 w-16 bg-alert/10 rounded-2xl flex items-center justify-center text-alert">
                <ShieldAlert className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black italic">Invalid Ride ID</h2>
            <Button variant="premium" onClick={() => router.push('/')}>Back to Home</Button>
        </div>
    )

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background font-sans select-none">

            {/* 1. INFINITE MAP BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <Map driverLocation={driverLocation} />
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
                                onClick={handleCancelRequest}
                            >
                                Cancel Request
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Arriving/In-Progress Status (Top Floating) */}
            {(status === 'arriving' || status === 'started') && (
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
                                {status === 'arriving' ? (rideData?.status === 'arrived' ? 'Partner Arrived' : 'Partner Arriving') : 'Trip Live'}
                            </p>
                            <h2 className="text-lg font-black text-white leading-tight">
                                {status === 'arriving' ? (rideData?.status === 'arrived' ? 'Your partner is here' : `Arriving in ${eta} mins`) : 'En Route to Destination'}
                            </h2>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Driver Details (Bottom Floating Sheet) */}
            {status !== 'searching' && assignedDriver && (
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
                                <p className="text-sm font-black text-white">₹{rideData?.fare || '145.00'}</p>
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
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push('/passenger/emergency')}
                                    className="flex flex-col items-center gap-2 py-5 rounded-[2rem] bg-alert/10 border border-alert/20 text-alert group"
                                >
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
