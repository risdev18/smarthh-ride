"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Power,
    LogOut,
    Navigation,
    Phone,
    MessageCircle,
    CheckCircle,
    ChevronRight,
    Star,
    Wallet,
    TrendingUp,
    MapPin,
    AlertCircle,
    UserCircle,
    FileText,
    ArrowRight,
    Clock,
    ShieldCheck,
    Loader2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useUserStore } from "@/lib/store/useUserStore"
import { rideService, RideRequest } from "@/lib/services/rideService"
import { driverService } from "@/lib/services/driverService"
import { motion, AnimatePresence } from "framer-motion"
import IncomingRideRequest from "@/components/driver/IncomingRideRequest"
import dynamic from "next/dynamic"

// Dynamic Map Import
const Map = dynamic(() => import("@/components/map/MapComponent"), { ssr: false })

export default function DriverDashboard() {
    const router = useRouter()
    const { user, logout } = useUserStore()

    // Status State
    const [status, setStatus] = useState<'online' | 'offline'>('offline')
    const [rideStatus, setRideStatus] = useState<'idle' | 'request' | 'navigating' | 'arrived' | 'started' | 'completed'>('idle')
    const [activeRide, setActiveRide] = useState<RideRequest | null>(null)

    // UI State
    const [otpInput, setOtpInput] = useState("")
    const [stats, setStats] = useState({ today: 0, trips: 0, rating: 4.8 })
    const [loading, setLoading] = useState(false)

    // GPS & Routing State
    const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null)
    const [routeCoords, setRouteCoords] = useState<{ lat: number, lng: number }[] | null>(null)
    const [eta, setEta] = useState<string | null>(null)

    // 🕵️ 1. INITIALIZE DRIVER: Get Location & Restore Active Ride
    useEffect(() => {
        if (!user?.id) return

        // A. Get Location
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    const newLocation = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    };
                    setDriverLocation(newLocation);

                    // Sync with Firestore if online
                    if (status === 'online' && user?.id) {
                        driverService.updateDriverLocation(user.id, newLocation.lat, newLocation.lng);
                    }
                },
                (err) => console.error("GPS Error:", err),
                { enableHighAccuracy: true }
            )
            return () => navigator.geolocation.clearWatch(watchId)
        }

        // B. Restore State
        const checkActiveRide = async () => {
            const existingRide = await rideService.getDriverActiveRide(user.id!)
            if (existingRide) {
                setActiveRide(existingRide)
                setRideStatus(existingRide.status as any)
                setStatus('online')
            }
        }
        checkActiveRide()

    }, [user?.id, status])

    // 🛣️ 2. CALCULATE ROUTE WHEN RIDE IS ACTIVE
    useEffect(() => {
        const fetchRoute = async () => {
            if (!activeRide || !driverLocation) return

            let end = { lat: activeRide.pickup.lat, lng: activeRide.pickup.lng }
            if (rideStatus === 'started') {
                end = { lat: activeRide.drop.lat, lng: activeRide.drop.lng }
            }

            if (rideStatus === 'navigating' || rideStatus === 'started') {
                const routeData = await rideService.getSmartRoute(driverLocation, end)
                if (routeData) {
                    setRouteCoords(routeData.coordinates)
                    setEta(`${routeData.duration} min`)
                }
            }
        }

        fetchRoute()
        const interval = setInterval(fetchRoute, 30000)
        return () => clearInterval(interval)
    }, [activeRide, rideStatus, driverLocation])

    // 0. LISTEN TO STATS
    useEffect(() => {
        if (!user?.id) return
        const unsubscribe = rideService.listenToDriverStats(user.id, (newStats) => {
            setStats(prev => ({ ...prev, ...newStats }))
        })
        return () => unsubscribe()
    }, [user?.id])

    // 3. LISTEN FOR REAL RIDES
    useEffect(() => {
        if (status !== 'online' || rideStatus !== 'idle' || !driverLocation) return

        const unsubscribe = rideService.listenForAvailableRides(
            driverLocation.lat,
            driverLocation.lng,
            50,
            (rides) => {
                if (rides.length > 0 && rideStatus === 'idle') {
                    setActiveRide(rides[0])
                    setRideStatus('request')
                }
            }
        )
        return () => unsubscribe()
    }, [status, rideStatus, driverLocation])

    // 2. LISTEN TO ACTIVE RIDE UPDATES
    useEffect(() => {
        if (!activeRide?.id || !user?.id) return
        const unsubscribe = rideService.listenToRide(activeRide.id, (updatedRide) => {
            setActiveRide(updatedRide)
            if (updatedRide.status !== 'pending' && updatedRide.driverId !== user.id) {
                if (rideStatus === 'request') {
                    setRideStatus('idle')
                    setActiveRide(null)
                } else if (updatedRide.status === 'cancelled') {
                    alert("Ride was cancelled by passenger")
                    setRideStatus('idle')
                    setActiveRide(null)
                }
            }
        })
        return () => unsubscribe()
    }, [activeRide?.id, user?.id, rideStatus])

    const handleAcceptRide = async () => {
        if (!activeRide?.id || !user) return
        setLoading(true)
        try {
            await rideService.acceptRide(activeRide.id, user.id, user.name, user.phone, user.vehicleNumber || 'AX-4137')
            setRideStatus('navigating')
        } catch (e) {
            alert("Could not accept ride")
            setRideStatus('idle')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (newStatus: RideRequest['status']) => {
        if (!activeRide?.id) return
        await rideService.updateRideStatus(activeRide.id, newStatus)
        setRideStatus(newStatus as any)
    }

    const handleVerifyOTP = () => {
        if (otpInput === activeRide?.otp) {
            handleUpdateStatus('started')
            setOtpInput("")
        } else {
            alert("Invalid OTP!")
        }
    }

    if (!user) return null

    // 🛡️ REJECTION STATE
    if (user.status === 'rejected') {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center sm:p-12">
                <div className="bg-red-500/10 p-6 sm:p-8 rounded-[3rem] border border-red-500/20 mb-8 shadow-[0_0_60px_rgba(239,68,68,0.1)]">
                    <AlertCircle className="h-16 w-16 sm:h-20 sm:w-20 text-red-500" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tighter mb-4 balance-text">Mission Compromised</h1>
                <p className="text-slate-500 max-w-xs mb-10 text-sm sm:text-base leading-relaxed">Your profile verification failed to meet fleet standards. Please update credentials for re-authorization.</p>
                <div className="flex flex-col w-full max-w-xs gap-4">
                    <Button
                        className="h-16 bg-white text-black font-black rounded-2xl sm:rounded-3xl tracking-widest active:scale-95 transition-all"
                        onClick={() => router.push("/driver/documents")}
                    >
                        RE-SUBMIT PROTOCOL
                    </Button>
                    <Button variant="ghost" className="text-slate-600 font-black h-12 uppercase tracking-widest text-[10px]" onClick={() => logout()}>SIGNOUT</Button>
                </div>
            </div>
        )
    }

    // 🛡️ PENDING/INCOMPLETE STATE
    if (user.status === 'pending' || user.status === 'incomplete' || !user.isApproved) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col p-6 sm:p-10 font-sans">
                <header className="flex justify-between items-center mb-10 sm:mb-16">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic leading-none">SMARTH<span className="text-primary">RIDES</span></h1>
                    <button onClick={() => logout()} className="h-12 w-12 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 active:scale-90 transition-transform">
                        <LogOut className="h-5 w-5" />
                    </button>
                </header>

                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Clock className="text-primary h-24 w-24 sm:h-32 sm:w-32 -mr-8 -mt-8 rotate-12" />
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">Authorization <br /> Pending</h2>
                        <p className="text-slate-500 font-bold mb-10 text-xs sm:text-sm uppercase tracking-wide leading-relaxed">
                            Fleet command is validating your credentials. Access granted upon successful encryption.
                        </p>

                        <div className="space-y-4 sm:space-y-6">
                            {[
                                { label: 'Handshake Established', done: true },
                                { label: 'Protocol Submission', done: user.status === 'pending' },
                                { label: 'Auth verification', done: true },
                                { label: 'Final Deployment', done: false }
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-4 sm:gap-5">
                                    <div className={`h-6 w-6 sm:h-7 sm:w-7 rounded-xl flex items-center justify-center transition-all ${step.done ? 'bg-primary text-black' : 'bg-slate-800 text-slate-600'}`}>
                                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <span className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] ${step.done ? 'text-white' : 'text-slate-600'}`}>{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        className="mt-10 h-16 sm:h-20 bg-primary text-black font-black rounded-3xl group tracking-widest active:scale-[0.98] transition-all shadow-xl shadow-primary/10"
                        onClick={() => router.push("/driver/documents")}
                    >
                        {user.status === 'incomplete' ? "DEPLOY DOCUMENTS" : "REVIEW DATA"}
                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white relative font-sans overflow-hidden">
            {/* TOP HUD */}
            <header className="absolute top-0 inset-x-0 z-20 p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:items-center justify-between pointer-events-none">
                <div className="flex items-center gap-3 pointer-events-auto">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-3xl shadow-2xl flex items-center gap-4">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5">
                            <Wallet className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="pr-2">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Impact Yield</p>
                            <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter leading-none">₹{stats.today}</h2>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 pointer-events-auto">
                    <button
                        onClick={async () => {
                            const newStatus = status === 'online' ? 'offline' : 'online';
                            setStatus(newStatus);
                            if (user?.id) {
                                await driverService.updateDriverStatus(user.id, newStatus);
                                if (newStatus === 'online' && driverLocation) {
                                    await driverService.updateDriverLocation(user.id, driverLocation.lat, driverLocation.lng);
                                }
                            }
                        }}
                        className={`flex-1 sm:flex-none h-14 px-6 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all border-2 flex items-center justify-center gap-2 ${status === 'online' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-primary text-black border-primary shadow-lg shadow-primary/20'}`}
                    >
                        <Power className="h-4 w-4" />
                        {status === 'online' ? 'Deploy Offline' : 'Deploy Online'}
                    </button>
                    <button onClick={logout} className="h-14 w-14 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-slate-500 active:scale-90 transition-transform">
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* MAIN INTERFACE */}
            <main className="flex-1 relative overflow-hidden flex flex-col">
                {/* MAP & SCANNING */}
                <div className="absolute inset-0 z-0">
                    {driverLocation ? (
                        <Map
                            center={driverLocation}
                            zoom={16}
                            showUserLocation={true}
                            routeCoordinates={routeCoords || undefined}
                        />
                    ) : (
                        <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center gap-4">
                            <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Locating Hub...</p>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 pointer-events-none"></div>

                    <AnimatePresence>
                        {status === 'online' && rideStatus === 'idle' && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.05, 0.2] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute h-64 w-64 sm:h-[400px] sm:w-[400px] rounded-[4rem] border border-primary/20 rotate-45"></motion.div>
                                <div className="text-center space-y-4">
                                    <div className="h-20 w-20 sm:h-24 sm:w-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto ring-1 ring-primary/20 animate-pulse">
                                        <Navigation className="h-10 w-10 text-primary" />
                                    </div>
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Scanning Grid</h2>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>

                    {status === 'offline' && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-10 p-6">
                            <div className="text-center space-y-6 sm:space-y-10 animate-in fade-in zoom-in duration-500">
                                <h2 className="text-6xl sm:text-8xl font-black text-slate-900 uppercase italic leading-none tracking-tighter">OFFLINE</h2>
                                <p className="text-[10px] sm:text-xs text-slate-600 font-black uppercase tracking-[0.5em] balance-text">Switch presence protocol to initialize missions</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* MODALS & PANELS */}
                <AnimatePresence>
                    {rideStatus === 'request' && activeRide && (
                        <IncomingRideRequest
                            ride={activeRide}
                            onAccept={handleAcceptRide}
                            onReject={() => {
                                setRideStatus('idle')
                                setActiveRide(null)
                            }}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {(rideStatus === 'navigating' || rideStatus === 'arrived' || rideStatus === 'started') && activeRide && (
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} className="absolute bottom-0 inset-x-0 z-30 p-4 sm:p-6">
                            <div className="max-w-xl mx-auto bg-slate-900 border border-white/5 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
                                {/* Activity Pulse */}
                                <div className="absolute top-0 inset-x-0 h-1 bg-white/5 overflow-hidden">
                                    <motion.div
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
                                    />
                                </div>

                                <div className="flex justify-between items-start gap-4 mb-6 sm:mb-8">
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] leading-none">
                                                {rideStatus === 'navigating' ? `Inbound (${eta || '...'})` : rideStatus === 'arrived' ? 'At Hub' : `Deploying (${eta || '...'})`}
                                            </p>
                                        </div>
                                        <h3 className="text-xl sm:text-3xl font-black text-white italic truncate uppercase tracking-tighter">
                                            {rideStatus === 'started' ? activeRide.drop.address : activeRide.pickup.address}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="bg-white/5 px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/5">
                                                <Star className="h-3 w-3 fill-primary text-primary" />
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">VIP PASSENGER</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="h-14 w-14 sm:h-16 sm:w-16 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center text-primary active:scale-90 transition-transform">
                                        <Phone className="h-6 w-6 sm:h-7 sm:w-7" />
                                    </button>
                                </div>

                                {rideStatus === 'navigating' && (
                                    <button
                                        onClick={() => handleUpdateStatus('arrived')}
                                        className="w-full h-16 sm:h-20 bg-primary text-black font-black text-xl sm:text-2xl rounded-3xl sm:rounded-3xl uppercase tracking-tighter flex items-center justify-center gap-4 active:scale-95 transition-all shadow-xl shadow-primary/20"
                                    >
                                        HUB ARRIVAL <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8" />
                                    </button>
                                )}

                                {rideStatus === 'arrived' && (
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="OTP"
                                            className="flex-1 h-16 sm:h-20 bg-black border border-white/5 text-3xl sm:text-4xl font-black text-center tracking-[0.5em] rounded-2xl sm:rounded-[2rem] text-primary placeholder:text-slate-800 outline-none focus:border-primary transition-all"
                                            maxLength={4}
                                            value={otpInput}
                                            onChange={(e) => setOtpInput(e.target.value)}
                                        />
                                        <button
                                            onClick={handleVerifyOTP}
                                            className="h-16 sm:h-20 w-24 sm:w-32 bg-primary text-black font-black text-xl rounded-2xl sm:rounded-[2rem] active:scale-95 transition-transform"
                                        >
                                            GO
                                        </button>
                                    </div>
                                )}

                                {rideStatus === 'started' && (
                                    <button
                                        onClick={() => handleUpdateStatus('completed')}
                                        className="w-full h-16 sm:h-20 bg-green-600 text-white font-black text-xl sm:text-2xl rounded-3xl uppercase tracking-tighter flex items-center justify-center gap-4 active:scale-95 transition-all shadow-xl shadow-green-500/20"
                                    >
                                        COMPLETE DEST <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {rideStatus === 'completed' && activeRide && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className="bg-green-500/10 h-24 w-24 sm:h-32 sm:w-32 rounded-[2.5rem] sm:rounded-[3.5rem] flex items-center justify-center mb-8 ring-4 ring-green-500/10 animate-bounce">
                                <CheckCircle className="h-12 w-12 sm:h-20 sm:w-20 text-green-500" />
                            </div>
                            <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter mb-4 leading-none">Mission <br /> Success</h1>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-12">Capture physical settlement</p>

                            <div className="bg-slate-900/50 border border-white/5 p-8 sm:p-12 rounded-[3.5rem] sm:rounded-[4.5rem] w-full max-w-sm mb-12 shadow-2xl">
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Total Yield Captured</p>
                                <h2 className="text-6xl sm:text-8xl font-black italic tracking-tighter leading-none"><span className="text-2xl sm:text-3xl text-slate-800 mr-2">₹</span>{activeRide.fare}</h2>
                            </div>

                            <button
                                className="w-full max-w-sm h-20 bg-white text-black font-black text-xl sm:text-2xl rounded-[2.5rem] active:scale-95 transition-all tracking-widest"
                                onClick={() => {
                                    setRideStatus('idle')
                                    setActiveRide(null)
                                }}
                            >
                                REDEPLOY ONLINE
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* STATS FOOTER */}
            <footer className="h-20 sm:h-24 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 shrink-0 relative z-30">
                {[
                    { label: 'Rating', value: stats.rating, icon: Star, color: 'text-yellow-500' },
                    { label: 'Trips', value: stats.trips, icon: TrendingUp, color: 'text-primary' },
                    { label: 'Pilot', value: 'GOLD', icon: ShieldCheck, color: 'text-primary' }
                ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3">
                        <div className={`h-8 w-8 sm:h-11 sm:w-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 ${stat.color}`}>
                            <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="hidden min-[400px]:block">
                            <p className="text-[8px] sm:text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <h4 className="text-xs sm:text-sm font-black text-white italic tracking-tighter leading-none">{stat.value}</h4>
                        </div>
                        {/* Mobile Compact Only Value */}
                        <div className="block min-[400px]:hidden">
                            <h4 className="text-[10px] font-black text-white italic tracking-tighter leading-none">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </footer>
        </div>
    )
}
