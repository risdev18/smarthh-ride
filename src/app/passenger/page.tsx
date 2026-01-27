"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Navigation, Menu, X, LogOut, ShieldCheck, User } from "lucide-react"
import { useUserStore } from "@/lib/store/useUserStore"
import { driverService } from "@/lib/services/driverService"
import { motion, AnimatePresence } from "framer-motion"

// Dynamic import for Map to avoid SSR window error
const Map = dynamic(() => import("@/components/map/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-900 animate-pulse flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs">Initializing Satellite Link...</div>
})

export default function PassengerHome() {
    const router = useRouter()
    const { user, logout } = useUserStore()
    const [nearbyDrivers, setNearbyDrivers] = useState<any[]>([])
    const [location, setLocation] = useState({ lat: 18.5204, lng: 73.8567 })
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // 1. Get User Location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            })
        }
    }, [])

    // 2. Listen to Nearby Drivers
    useEffect(() => {
        if (!user) return
        const unsubscribe = driverService.listenToNearbyDrivers((drivers) => {
            setNearbyDrivers(drivers.filter(d => d.location && d.location.lat));
        })
        return () => unsubscribe()
    }, [user])

    // Auth Check
    useEffect(() => {
        if (!user) {
            router.push("/")
        }
    }, [user, router])

    if (!user) return null

    return (
        <div className="relative h-screen w-full flex flex-col overflow-hidden bg-slate-950 font-sans">
            {/* FULL-SCREEN MAP */}
            <div className="absolute inset-0 z-0 select-none">
                <Map center={location} drivers={nearbyDrivers} />
                {/* Map Overlay for better UI legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/60 pointer-events-none"></div>
            </div>

            {/* Top Navigation */}
            <header className="relative z-30 p-4 sm:p-6 lg:p-8 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="h-12 w-12 sm:h-14 sm:w-14 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl pointer-events-auto active:scale-90 transition-transform"
                    >
                        <Menu className="h-6 w-6 text-white" />
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/90 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-2.5 rounded-full shadow-2xl border border-white/20 flex items-center gap-2 pointer-events-auto"
                >
                    <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white font-black italic uppercase tracking-tighter text-[10px] sm:text-xs">No Surge Live</span>
                </motion.div>
            </header>

            {/* Sidebar Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] sm:w-[320px] bg-slate-900 border-r border-white/5 z-50 p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
                                    <User className="h-6 w-6 text-black" />
                                </div>
                                <button onClick={() => setIsMenuOpen(false)} className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center">
                                    <X className="h-5 w-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-black italic uppercase tracking-tight text-white">{user.name}</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{user.phone || 'Verified User'}</p>
                            </div>

                            <nav className="flex-1 space-y-2">
                                {[
                                    { label: 'My Rides', icon: MapPin },
                                    { label: 'Safety Hub', icon: ShieldCheck },
                                    { label: 'Settings', icon: Menu },
                                ].map((item) => (
                                    <button key={item.label} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-300 transition-colors group">
                                        <item.icon className="h-5 w-5 group-hover:text-primary" />
                                        <span className="font-black uppercase tracking-widest text-xs">{item.label}</span>
                                    </button>
                                ))}
                            </nav>

                            <button
                                onClick={() => { logout(); router.push("/"); }}
                                className="mt-auto flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="font-black uppercase tracking-widest text-xs">Terminate Session</span>
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Bottom Section */}
            <div className="mt-auto relative z-20 w-full max-w-lg mx-auto p-4 sm:p-6 pb-8 sm:pb-12 space-y-4">
                {/* Fixed Action Button: Recenter */}
                <div className="flex justify-end pr-2">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all group"
                    >
                        <Navigation className="h-7 w-7 text-black group-hover:rotate-12 transition-transform" />
                    </motion.button>
                </div>

                {/* Main Action Sheet */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)] space-y-6 sm:space-y-8"
                >
                    {/* Destination Search */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Departure Hub</label>
                        <div
                            onClick={() => router.push('/passenger/book')}
                            className="relative group cursor-pointer"
                        >
                            <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                <Search className="h-6 w-6 text-primary" />
                            </div>
                            <div className="w-full h-16 sm:h-20 bg-slate-950/50 border-2 border-slate-800 rounded-3xl pl-16 pr-6 flex items-center text-lg sm:text-xl font-bold text-white group-hover:border-primary/50 transition-all">
                                <span className="opacity-50 font-black italic italic tracking-tight">Search Destination...</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Grids */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Quick Directs</span>
                            <div className="h-px flex-1 bg-white/5 mx-4"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {[
                                { name: 'Hospital', icon: '🏥', color: 'bg-red-500/10' },
                                { name: 'Transit Station', icon: '🚉', color: 'bg-blue-500/10' },
                                { name: 'Mega Market', icon: '🛒', color: 'bg-orange-500/10' },
                                { name: 'Bus Stand', icon: '🚌', color: 'bg-green-500/10' }
                            ].map((place) => (
                                <button
                                    key={place.name}
                                    onClick={() => router.push('/passenger/book')}
                                    className="flex flex-col items-start gap-2 bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-primary/30 p-4 rounded-3xl transition-all active:scale-[0.98] group"
                                >
                                    <div className={`h-10 w-10 ${place.color} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                                        {place.icon}
                                    </div>
                                    <span className="font-black italic uppercase tracking-tighter text-[11px] sm:text-xs text-slate-300">{place.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Blue Pulse Marker for User (Center UI Representation) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <div className="relative">
                    <div className="h-4 w-4 sm:h-5 sm:w-5 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse"></div>
                    <div className="absolute inset-0 h-4 w-4 sm:h-5 sm:w-5 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                </div>
            </div>
        </div>
    )
}
