"use client"

import dynamic from "next/dynamic"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Phone, ShieldAlert, Share2, Star, Navigation, MapPin, User, Search, Loader2, XCircle, MessageSquare, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { rideService, RideRequest } from "@/lib/services/rideService"
import { driverService } from "@/lib/services/driverService"
import { useUserStore } from "@/lib/store/useUserStore"

// Dynamic Map
const Map = dynamic(() => import("@/components/map/MapComponent"), { ssr: false })

function TrackingContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const rideId = searchParams.get('rideId')

    const [ride, setRide] = useState<RideRequest | null>(null)
    const [searchStatusText, setSearchStatusText] = useState("Connecting...")
    const { user } = useUserStore()

    // 1. LISTEN TO RIDE UPDATES
    useEffect(() => {
        if (!rideId) return
        const unsubscribe = rideService.listenToRide(rideId, (updatedRide) => {
            setRide(updatedRide)
        })
        return () => unsubscribe()
    }, [rideId])

    // 2. ROTATING STATUS TEXT (Only while searching)
    useEffect(() => {
        if (!ride || ride.status !== 'pending') return

        const texts = [
            "Syncing Fleet...",
            "Locating Pilots...",
            "Securing Channel...",
            "Routing Logic..."
        ]
        let i = 0
        const interval = setInterval(() => {
            i = (i + 1) % texts.length
            setSearchStatusText(texts[i])
        }, 2500)

        return () => clearInterval(interval)
    }, [ride?.status])

    const handleCancel = async () => {
        if (!rideId) return
        if (confirm("Are you sure you want to cancel this request?")) {
            await rideService.cancelRide(rideId)
            router.push('/passenger/book')
        }
    }

    if (!rideId) return (
        <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center sm:p-12">
            <XCircle className="h-20 w-20 text-red-500 mb-6" />
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight">Session Invalid</h1>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto">Active ride execution sequence could not be established.</p>
            <Button className="w-full max-w-xs h-16 bg-white text-black font-black rounded-[1.5rem] tracking-widest active:scale-95 transition-transform" onClick={() => router.push('/passenger')}>RETURN TO HUB</Button>
        </div>
    )

    // 3. FETCH ROUTE (Real Road)
    const [routeCoords, setRouteCoords] = useState<{ lat: number, lng: number }[] | null>(null)
    const [eta, setEta] = useState<string | null>(null)

    useEffect(() => {
        const updateRoute = async () => {
            if (!ride || ride.status === 'pending' || ride.status === 'completed' || ride.status === 'cancelled') return
            let start = ride.pickup
            let end = ride.drop
            if (ride.status === 'started') {
                start = ride.pickup
                end = ride.drop
            }
            const routeData = await rideService.getSmartRoute(start, end)
            if (routeData) {
                setRouteCoords(routeData.coordinates)
                setEta(`${routeData.duration} min`)
            }
        }
        updateRoute()
    }, [ride])

    // 4. FETCH DRIVER LOCATION
    const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null)

    useEffect(() => {
        if (!ride?.driverId || ride.status === 'completed' || ride.status === 'cancelled') return

        const unsubscribe = driverService.listenToDriverLocation(ride.driverId, (loc: { lat: number, lng: number } | null) => {
            if (loc) setDriverLocation(loc)
        })
        return () => unsubscribe()
    }, [ride?.driverId, ride?.status])

    return (
        <div className="relative h-screen w-full flex flex-col bg-slate-950 font-sans overflow-hidden">
            <div className="absolute inset-0 z-0 select-none">
                <Map
                    center={ride?.status === 'started' ? (driverLocation || ride?.drop || { lat: 0, lng: 0 }) : (driverLocation || ride?.pickup || { lat: 0, lng: 0 })}
                    zoom={15}
                    routeCoordinates={routeCoords || undefined}
                    drivers={ride?.driverId && driverLocation ? [{
                        id: ride.driverId,
                        location: driverLocation,
                        name: ride.driverName
                    }] : []}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 pointer-events-none"></div>
            </div>

            {/* RADAR SCAN OVERLAY (SEARCHING) */}
            <AnimatePresence>
                {(!ride || ride.status === 'pending') && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl p-8"
                    >
                        {/* High-Tech Radar */}
                        <div className="relative h-48 w-48 sm:h-64 sm:w-64 flex items-center justify-center mb-10">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 border-2 border-primary/20 rounded-[2.5rem] rotate-12"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: [0.8, 1.8], opacity: [0.6, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.8, ease: "linear" }}
                                />
                            ))}
                            <div className="h-20 w-20 sm:h-24 sm:w-24 bg-primary rounded-[2rem] flex items-center justify-center shadow-[0_0_60px_rgba(255,215,0,0.3)] z-10">
                                <Search className="h-8 w-8 sm:h-10 sm:w-10 text-black animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-2 text-center">
                            <h2 className="text-2xl sm:text-4xl font-black text-white italic uppercase tracking-tighter balance-text leading-none min-h-[1.2em]">
                                {searchStatusText}
                            </h2>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[9px] sm:text-[10px]">Encrypted Handshake Active</p>
                        </div>

                        <button
                            className="mt-16 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs hover:text-red-500 transition-colors py-4 px-8 border border-white/5 rounded-2xl active:scale-95"
                            onClick={handleCancel}
                        >
                            Terminate Pipeline
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER (IF DRIVER ASSIGNED) */}
            <AnimatePresence>
                {ride && ride.status !== 'pending' && (
                    <motion.header
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="relative z-10 p-4 sm:p-6 lg:p-8"
                    >
                        <div className="w-full max-w-lg mx-auto bg-slate-900/80 backdrop-blur-2xl border border-white/5 p-4 sm:p-5 rounded-[2rem] flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                                <Navigation className="h-5 w-5 sm:h-6 sm:w-6 text-black animate-pulse" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none mb-1">
                                    {ride.status === 'accepted' ? 'Pilot Inbound' : ride.status === 'arrived' ? 'Pilot on Site' : 'En Route'}
                                </p>
                                <h2 className="text-sm sm:text-lg font-black text-white uppercase italic tracking-tight truncate leading-none">
                                    {ride.status === 'started' ? `To: ${ride.drop.address}` : `Pickup: ${ride.pickup.address}`}
                                </h2>
                            </div>
                        </div>
                    </motion.header>
                )}
            </AnimatePresence>

            {/* BOTTOM PANEL (DRIVER DETAILS) */}
            <AnimatePresence>
                {ride && ride.status !== 'pending' && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        className="mt-auto relative z-10 w-full max-w-lg mx-auto p-4 sm:p-6 pb-6 sm:pb-10"
                    >
                        <div className="bg-slate-900/95 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden">
                            {/* Mission Critical Banner */}
                            <div className="bg-slate-950/80 p-5 sm:p-6 flex justify-between items-center border-b border-white/5">
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Authorization OTP</p>
                                    <h3 className="text-3xl sm:text-4xl font-black text-primary tracking-[0.3em] italic leading-none">{ride.otp}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Impact ETA</p>
                                    <div className="flex items-center justify-end gap-2">
                                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                                        <p className="text-xl sm:text-2xl font-black text-white italic tracking-tighter leading-none">{eta ? eta : '4 MIN'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pilot Intel */}
                            <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-[1.5rem] sm:rounded-[2rem] bg-slate-950 border border-white/5 flex items-center justify-center overflow-hidden shrink-0">
                                        <User className="h-8 w-8 sm:h-10 sm:w-10 text-slate-800" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tight leading-none mb-2 truncate">{ride.driverName}</h2>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="bg-green-500/10 px-2 py-1 rounded-lg flex items-center gap-1.5 border border-green-500/20 shadow-sm shadow-green-500/10">
                                                <Star className="h-3 w-3 fill-green-500 text-green-500" />
                                                <span className="text-[10px] sm:text-xs font-black text-green-500 tracking-widest">4.8</span>
                                            </div>
                                            <span className="text-slate-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest truncate">
                                                • {ride.driverVehicleNumber || 'AX-4137'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Action Grid */}
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    <button className="flex flex-col items-center justify-center h-16 sm:h-20 gap-1 sm:gap-2 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all group">
                                        <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:rotate-12 transition-transform" />
                                        <span className="font-black text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500">Call Pilot</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center h-16 sm:h-20 gap-1 sm:gap-2 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all group">
                                        <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:scale-110 transition-transform" />
                                        <span className="font-black text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-500">Comm Link</span>
                                    </button>
                                    <button className="flex flex-col items-center justify-center h-16 sm:h-20 gap-1 sm:gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl hover:bg-red-500 text-white active:scale-95 transition-all group">
                                        <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" />
                                        <span className="font-black text-[8px] sm:text-[9px] uppercase tracking-widest">SOS</span>
                                    </button>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={handleCancel}
                                        className="w-full h-14 rounded-2xl bg-slate-950 border border-white/5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-600 hover:text-red-500 hover:border-red-500/20 active:scale-95 transition-all"
                                    >
                                        Cancel Mission
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function RideTracking() {
    return (
        <Suspense fallback={
            <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-8 gap-4 text-center">
                <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Establishing Uplink...</p>
            </div>
        }>
            <TrackingContent />
        </Suspense>
    )
}
