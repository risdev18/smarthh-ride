"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDriverStore } from "@/lib/store/useDriverStore"
import { useUserStore } from "@/lib/store/useUserStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Power, MapPin, Navigation, IndianRupee, AlertTriangle, Clock, Map as MapIcon, Phone, MessageCircle, CheckCircle, ShieldCheck, Star, Hexagon, Gauge, Loader2, LogOut, ArrowRight, User, History, Languages, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { driverService } from "@/lib/services/driverService"
import { rideService, Ride } from "@/lib/services/rideService"
import { db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, limit, doc } from "@firebase/firestore"

// Dynamic Map
const Map = dynamic(() => import("@/components/map/MapComponent"), { ssr: false })

export default function DriverDashboard() {
    const router = useRouter()
    const { user, logout: logoutUser } = useUserStore()
    const { status, setStatus, rideStatus, setRideStatus } = useDriverStore()

    const [eta, setEta] = useState(3)
    const [isUpdating, setIsUpdating] = useState(false)
    const [driverLoc, setDriverLoc] = useState<{ lat: number, lng: number } | null>(null)
    const [showHub, setShowHub] = useState(false)

    const [pendingRide, setPendingRide] = useState<Ride | null>(null)
    const [activeRide, setActiveRide] = useState<Ride | null>(null)
    const [earnings, setEarnings] = useState({ today: 0, rides: 0 })
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [cancelReason, setCancelReason] = useState("")

    // 1. Check Auth
    useEffect(() => {
        if (!user || user.role !== 'driver') router.push("/")
    }, [user])

    // 2. Fetch Earnings Summary
    useEffect(() => {
        if (user?.id) {
            const fetchStats = async () => {
                const history = await rideService.getDriverHistory(user.id)
                const todayTotal = history.reduce((sum, r) => sum + r.fare, 0)
                setEarnings({ today: todayTotal, rides: history.length })
            }
            fetchStats()
        }
    }, [user?.id, rideStatus])

    // 3. Listen for Incoming Requests (Global Pending)
    useEffect(() => {
        if (status === 'online' && rideStatus === 'idle') {
            const q = query(collection(db, "rides"), where("status", "==", "pending"), limit(1))
            const unsubscribe = onSnapshot(q, (snapshot) => {
                if (!snapshot.empty) {
                    const data = snapshot.docs[0].data() as Ride
                    setPendingRide({ id: snapshot.docs[0].id, ...data })
                } else {
                    setPendingRide(null)
                }
            })
            return () => unsubscribe()
        }
    }, [status, rideStatus])

    // 4. Listen for Active Ride Updates
    useEffect(() => {
        if (activeRide?.id) {
            const unsubscribe = onSnapshot(doc(db, "rides", activeRide.id), (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data() as Ride
                    setActiveRide({ id: docSnap.id, ...data })

                    // IF CANCELLED BY PASSENGER
                    if (data.status === 'cancelled' && rideStatus !== 'idle') {
                        alert("The passenger cancelled the ride.")
                        handleFinish()
                    }

                    // Sync local rideStatus with DB
                    if (data.status === 'accepted') setRideStatus('navigating')
                    if (data.status === 'arrived') setRideStatus('arrived')
                    if (data.status === 'in_progress') setRideStatus('in_progress')
                    if (data.status === 'completed') setRideStatus('completed')
                } else {
                    handleFinish()
                }
            })
            return () => unsubscribe()
        }
    }, [activeRide?.id])

    // 5. Location Tracking
    useEffect(() => {
        let watchId: number;
        if (status === 'online' && user?.id) {
            if ("geolocation" in navigator) {
                watchId = navigator.geolocation.watchPosition(async (pos) => {
                    const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                    setDriverLoc(loc)
                    await driverService.updateLocation(user.id!, loc)
                }, null, { enableHighAccuracy: true })
            }
        }
        return () => watchId && navigator.geolocation.clearWatch(watchId)
    }, [status, user?.id])

    // ACTIONS
    const handleAcceptRide = async () => {
        if (!pendingRide?.id || !user?.id) return
        await rideService.acceptRide(pendingRide.id, user.id, user.name)
        setActiveRide(pendingRide)
        setRideStatus('navigating')
        setPendingRide(null)
    }

    const handleRejectRide = async (reason: string) => {
        if (!pendingRide?.id) return
        // In a real sequential dispatch, this would notify the backend to skip this driver.
        // For now, we update the ride to cancelled if no other drivers exist, or just clear locally.
        setPendingRide(null)
        setShowCancelModal(false)
    }

    const handleArrived = async () => {
        if (!activeRide?.id) return
        await rideService.updateRideStatus(activeRide.id, 'arrived')
        setRideStatus('arrived')
    }

    const [otpInput, setOtpInput] = useState(["", "", "", ""])
    const [otpError, setOtpError] = useState(false)

    const handleVerifyOtp = async () => {
        if (otpInput.join("") === "4921") {
            if (!activeRide?.id) return
            await rideService.updateRideStatus(activeRide.id, 'in_progress')
            setRideStatus('in_progress')
        } else {
            setOtpError(true)
            setTimeout(() => setOtpError(false), 2000)
        }
    }

    const handleCompleteRide = async () => {
        if (!activeRide?.id) return
        await rideService.updateRideStatus(activeRide.id, 'completed')
        setRideStatus('completed')
    }

    const handleFinish = () => {
        setRideStatus('idle')
        setActiveRide(null)
        setOtpInput(["", "", "", ""])
    }

    const toggleAvailability = async (s: 'online' | 'offline') => {
        if (!user?.id) return
        setIsUpdating(true)
        await driverService.updateAvailability(user.id, s)
        setStatus(s)
        setIsUpdating(false)
    }

    const hubItems = [
        { name: "My Profile", icon: User, path: "/driver/profile", color: "text-primary" },
        { name: "Ride History", icon: History, path: "/driver/history", color: "text-blue-500" },
        { name: "My Earnings", icon: IndianRupee, path: "/driver/earnings", color: "text-green-500" },
        { name: "Preferred Area", icon: MapPin, path: "/driver/preferred-area", color: "text-orange-500" },
        { name: "Support", icon: ShieldCheck, path: "/support", color: "text-indigo-500" },
        { name: "Emergency", icon: AlertTriangle, path: "/driver/emergency", color: "text-alert" },
        { name: "Sign Out", icon: LogOut, path: "logout", color: "text-zinc-500" }
    ]

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background font-sans select-none">
            {/* Hub Overlay */}
            <AnimatePresence>
                {showHub && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] bg-background/95 backdrop-blur-3xl p-8">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-4xl font-black italic">Partner <span className="text-primary">Hub</span></h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowHub(false)}><X className="h-6 w-6" /></Button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {hubItems.map(item => (
                                <Button key={item.name} variant="ghost" className="h-20 w-full bg-surface border border-white/5 rounded-3xl px-6 flex items-center gap-6 justify-start" onClick={() => item.path === 'logout' ? (logoutUser(), router.push('/')) : router.push(item.path)}>
                                    <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color}`}><item.icon className="h-6 w-6" /></div>
                                    <span className="text-lg font-black uppercase tracking-widest">{item.name}</span>
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-6 left-6 z-50">
                <Button variant="ghost" size="icon" className="glass rounded-2xl h-12 w-12" onClick={() => setShowHub(true)}><User className="h-5 w-5" /></Button>
            </div>

            {/* Map */}
            <div className="absolute inset-0 z-0">
                <Map showUserLocation={status === 'online'} center={driverLoc || undefined} />
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/90" />
            </div>

            {/* Offline View */}
            <AnimatePresence>
                {status === 'offline' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
                        <div className="space-y-12 w-full max-w-sm">
                            <h1 className="text-5xl font-black text-white italic tracking-tighter opacity-20">OFFLINE</h1>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => toggleAvailability('online')} className="h-64 w-64 rounded-[4rem] bg-charcoal border-4 border-white/5 shadow-premium flex flex-col items-center justify-center gap-4">
                                <div className="h-24 w-24 bg-surface rounded-3xl flex items-center justify-center">
                                    {isUpdating ? <Loader2 className="animate-spin h-10 w-10 text-primary" /> : <Power className="h-12 w-12 text-primary" />}
                                </div>
                                <span className="text-lg font-black text-white uppercase tracking-widest">Go Online</span>
                            </motion.button>
                            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                                <div><p className="text-[10px] uppercase font-black text-muted-foreground">Today</p><p className="text-3xl font-black italic">₹{earnings.today}</p></div>
                                <div><p className="text-[10px] uppercase font-black text-muted-foreground">Rides</p><p className="text-3xl font-black italic">{earnings.rides}</p></div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {status === 'online' && (
                <div className="relative z-20 p-6 pt-12">
                    <div className="flex justify-between items-start">
                        <div className="bg-background/80 backdrop-blur-3xl rounded-[2.5rem] p-5 pr-8 border border-white/10 shadow-premium flex items-center gap-4">
                            <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-glow shrink-0"><IndianRupee className="h-7 w-7 text-background" /></div>
                            <div><p className="text-[10px] font-black text-muted-foreground uppercase leading-none mb-1">Status</p><h2 className="text-2xl font-black text-white">ACTIVE</h2></div>
                        </div>
                        <Button className="h-16 w-16 bg-alert rounded-2xl" onClick={() => toggleAvailability('offline')}><Power className="h-7 w-7" /></Button>
                    </div>

                    {rideStatus === 'idle' && (
                        <div className="mt-32 flex flex-col items-center gap-4">
                            <div className="relative h-40 w-40 flex items-center justify-center">
                                <motion.div animate={{ scale: [1, 1.8], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 border-2 border-primary rounded-full" />
                                <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center animate-pulse"><Navigation className="h-10 w-10 text-primary" /></div>
                            </div>
                            <p className="text-sm font-black text-primary uppercase tracking-[0.3em] italic">Scanning for local rides...</p>
                        </div>
                    )}
                </div>
            )}

            {/* Cancel Modal */}
            <AnimatePresence>
                {showCancelModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-6">
                        <div className="bg-surface border border-white/5 rounded-[3rem] p-10 w-full max-w-sm space-y-8">
                            <h2 className="text-2xl font-black italic">Reason for <span className="text-alert">Rejection</span></h2>
                            <div className="space-y-3">
                                {['Vehicle Issue', 'Too Far', 'Personal Reason', 'Busy'].map(r => (
                                    <Button key={r} variant="ghost" className="w-full h-14 bg-white/5 rounded-2xl justify-start font-bold" onClick={() => handleRejectRide(r)}>{r}</Button>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full h-14 rounded-2xl" onClick={() => setShowCancelModal(false)}>CANCEL</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ride Interaction Sheets */}
            <div className="absolute inset-x-0 bottom-0 z-30 p-6">
                <AnimatePresence>
                    {pendingRide && (
                        <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="bg-background rounded-[3.5rem] p-8 border border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                            <div className="flex justify-between items-start mb-8">
                                <div><p className="text-[10px] font-black text-primary uppercase">New {pendingRide.rideType || 'one-way'} Request</p><h2 className="text-2xl font-black italic">{pendingRide.pickup}</h2></div>
                                <div className="text-right"><p className="text-[10px] font-black text-muted-foreground">Est. Fare</p><h2 className="text-2xl font-black text-primary italic">₹{pendingRide.fare}</h2></div>
                            </div>
                            <div className="flex gap-4">
                                <Button className="flex-1 h-20 rounded-3xl bg-surface" onClick={() => setShowCancelModal(true)}>REJECT</Button>
                                <Button className="flex-1 h-20 rounded-3xl" variant="premium" onClick={handleAcceptRide}>ACCEPT RIDE</Button>
                            </div>
                        </motion.div>
                    )}

                    {rideStatus === 'navigating' && activeRide && (
                        <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="bg-background rounded-[3.5rem] p-8 border border-white/5 shadow-premium space-y-8">
                            <div className="flex justify-between items-start">
                                <div><p className="text-[10px] font-black text-primary uppercase">Pick Up Location</p><h2 className="text-2xl font-black italic">{activeRide.pickup}</h2></div>
                                <div className="flex gap-2"><Button className="h-14 w-14 bg-charcoal rounded-2xl" onClick={() => window.location.href = `tel:999`}><Phone className="h-6 w-6" /></Button></div>
                            </div>
                            <Button variant="premium" className="w-full h-20 text-2xl font-black rounded-3xl" onClick={handleArrived}>I HAVE ARRIVED</Button>
                        </motion.div>
                    )}

                    {rideStatus === 'arrived' && (
                        <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="bg-background rounded-[3.5rem] p-10 border border-white/5 shadow-premium text-center space-y-10">
                            <h2 className="text-3xl font-black italic">Enter <span className="text-primary">OTP</span></h2>
                            <div className="flex justify-center gap-4">
                                {[0, 1, 2, 3].map(i => (
                                    <input key={i} type="number" value={otpInput[i]} onChange={(e) => {
                                        const n = [...otpInput]; n[i] = e.target.value.slice(-1); setOtpInput(n);
                                        if (e.target.value && i < 3) document.getElementById(`otp-${i + 1}`)?.focus();
                                    }} id={`otp-${i}`} className="w-16 h-20 text-center text-4xl font-black bg-charcoal border-2 rounded-2xl outline-none" placeholder="•" />
                                ))}
                            </div>
                            <Button variant="premium" className="w-full h-20 text-2xl font-black rounded-3xl" onClick={handleVerifyOtp}>START TRIP</Button>
                        </motion.div>
                    )}

                    {rideStatus === 'in_progress' && activeRide && (
                        <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="bg-background rounded-[3.5rem] p-8 border border-white/5 shadow-premium space-y-8">
                            <div className="flex items-center gap-6">
                                <MapIcon className="h-10 w-10 text-primary" />
                                <div><p className="text-[10px] font-black text-primary uppercase">Destined For</p><h2 className="text-2xl font-black italic">{activeRide.drop}</h2></div>
                            </div>
                            <Button className="w-full h-20 text-2xl font-black bg-white text-background rounded-3xl" onClick={handleCompleteRide}>END RIDE</Button>
                        </motion.div>
                    )}

                    {rideStatus === 'completed' && activeRide && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-8 text-center space-y-12">
                            <div className="h-40 w-40 bg-green-500/10 rounded-full flex items-center justify-center shadow-glow shadow-green-500/20"><CheckCircle className="h-24 w-24 text-green-500" /></div>
                            <div><h1 className="text-5xl font-black italic uppercase">COLLECT <span className="text-primary italic">₹{activeRide.fare}</span></h1><p className="text-muted-foreground uppercase text-[10px] font-black tracking-widest mt-4">Ride Finished Successfully</p></div>
                            <Button variant="premium" className="w-full max-w-sm h-24 text-3xl font-black rounded-[2.5rem]" onClick={handleFinish}>CASH RECEIVED</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
