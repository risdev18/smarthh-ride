"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Navigation, Menu, Bell, LogOut, ArrowRight, Home, Briefcase, Map as MapIcon, ShoppingBag, ShieldCheck, Info, User } from "lucide-react"
import { useUserStore } from "@/lib/store/useUserStore"
import { motion, AnimatePresence } from "framer-motion"

// Dynamic import for Map to avoid SSR window error
const Map = dynamic(() => import("@/components/map/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-background animate-pulse flex items-center justify-center text-primary font-black uppercase tracking-widest italic">Loading Map View...</div>
})

export default function PassengerHome() {
    const router = useRouter()
    const { user, logout } = useUserStore()
    const [isLoaded, setIsLoaded] = useState(false)

    // Auth Check
    useEffect(() => {
        if (!user) {
            router.push("/")
        }
        setIsLoaded(true)
    }, [user, router])

    // Mock current location
    const [location] = useState({ lat: 18.5204, lng: 73.8567 })

    const [showHub, setShowHub] = useState(false)

    if (!user || !isLoaded) return null

    const hubItems = [
        { name: "Settings", icon: Home, path: "/settings", color: "text-blue-500" },
        { name: "Support", icon: ShieldCheck, path: "/support", color: "text-primary" },
        { name: "About", icon: Info, path: "/about", color: "text-orange-500" },
        { name: "Sign Out", icon: LogOut, path: "logout", color: "text-alert" }
    ]

    return (
        <div className="relative h-screen w-full bg-background overflow-hidden font-sans select-none">

            {/* Hub Overlay Menu */}
            <AnimatePresence>
                {showHub && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-background/95 backdrop-blur-3xl p-8 flex flex-col justify-between"
                    >
                        <div className="space-y-12">
                            <div className="flex justify-between items-center">
                                <h2 className="text-4xl font-black italic">Samarth <span className="text-primary">Hub</span></h2>
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
                                                logout()
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
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Samarth Ride - Vishwasacha Pravas</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-2">v1.0.0 · Saffar Labs India</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. INFINITE MAP BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <Map center={location} />
                {/* Vignette Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/60 pointer-events-none"></div>
            </div>

            {/* 2. FLOATING TOP INTERFACE */}
            <div className="relative z-20 p-6 flex items-start justify-between gap-4">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowHub(true)}
                    className="h-12 w-12 glass rounded-2xl flex items-center justify-center text-white border border-white/10"
                >
                    <User className="h-5 w-5" />
                </motion.button>

                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex-1 max-w-[280px]"
                >
                    <div className="glass-light backdrop-blur-xl rounded-[2rem] p-3 pl-4 pr-1.5 flex items-center gap-3 shadow-premium">
                        <div className="h-9 w-9 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-glow">
                            <img src="/logo.png" className="h-6 w-6 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Pick up from</p>
                            <h2 className="font-black text-xs text-background truncate">Shivaji Nagar, Pune</h2>
                        </div>
                        <button className="h-9 w-9 bg-charcoal rounded-full flex items-center justify-center text-white shrink-0">
                            <Menu className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>

                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="h-12 w-12 glass rounded-2xl flex items-center justify-center text-white relative border border-white/10"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-3 right-3 h-2 w-2 bg-primary rounded-full ring-2 ring-background"></span>
                </motion.button>
            </div>

            {/* 3. FLOATING ACTION SHEET (Bottom) */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-6 space-y-4">

                {/* My Location Floating Button */}
                <div className="flex justify-end pr-2">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="h-14 w-14 bg-primary text-background rounded-full shadow-premium flex items-center justify-center shadow-glow"
                    >
                        <Navigation className="h-6 w-6 stroke-[2.5px]" />
                    </motion.button>
                </div>

                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="bg-background rounded-[3rem] p-6 shadow-premium border border-white/5 relative overflow-hidden group"
                >
                    {/* Branding Accent */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/5 via-primary to-primary/5"></div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black tracking-tight text-white italic">
                                Samarth<span className="text-primary not-italic">Ride</span>
                            </h3>
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest bg-charcoal px-3 py-1 rounded-full italic">Vishwasacha Pravas</span>
                        </div>

                        {/* Search Bar - High Contrast */}
                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/passenger/book')}
                            className="relative group cursor-pointer"
                        >
                            <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                <Search className="h-6 w-6 text-primary" />
                            </div>
                            <div className="w-full h-16 bg-charcoal rounded-[2rem] border border-white/5 pl-14 pr-6 flex items-center text-muted-foreground font-bold text-lg group-hover:border-primary/30 transition-all">
                                Where do you want to go?
                            </div>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-background">
                                <ArrowRight className="h-5 w-5 stroke-[2.5px]" />
                            </div>
                        </motion.div>

                        {/* Quick Targets */}
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {[
                                { id: 'home', label: 'Home', icon: Home, color: 'text-blue-400' },
                                { id: 'work', label: 'Office', icon: Briefcase, color: 'text-orange-400' },
                                { id: 'mall', label: 'Seasons', icon: ShoppingBag, color: 'text-pink-400' },
                                { id: 'market', label: 'Market', icon: MapIcon, color: 'text-green-400' }
                            ].map((p, i) => (
                                <motion.button
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + (i * 0.05) }}
                                    key={p.id}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex flex-col items-center gap-2 group"
                                >
                                    <div className="h-16 w-16 glass rounded-[1.5rem] flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                                        <p.icon className={`h-6 w-6 ${p.color}`} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">{p.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
