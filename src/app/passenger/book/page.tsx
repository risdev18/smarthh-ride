"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Clock, MapPin, Search, Navigation2, X, CarFront, ChevronRight, Sparkles, ArrowRight, User, Users, Info, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"

// Dynamic Map (Reusing the component)
const Map = dynamic(() => import("@/components/map/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-background animate-pulse" />
})

export default function BookRide() {
    const router = useRouter()
    const [step, setStep] = useState<'search' | 'options' | 'finding'>('search')
    const [baseFare, setBaseFare] = useState(15) // Default base price
    const [fare, setFare] = useState(15) // Total display price
    const [passengers, setPassengers] = useState(1)
    const [selectedVehicle, setSelectedVehicle] = useState('auto')
    const [isMounted, setIsMounted] = useState(false)

    // Auto-calculate total fare when base price or passengers change
    useEffect(() => {
        setFare(baseFare * passengers)
    }, [baseFare, passengers])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Input States
    const [pickup, setPickup] = useState("Shivaji Nagar, Pune")
    const [destination, setDestination] = useState("")
    const [activeInput, setActiveInput] = useState<'pickup' | 'destination'>('destination')

    if (!isMounted) return <div className="h-screen w-full bg-background flex items-center justify-center text-primary font-black uppercase tracking-widest italic animate-pulse">Initializing Smarth...</div>

    const searchVal = activeInput === 'pickup' ? pickup : destination

    // Mock Suggestions
    const suggestions = [
        { name: 'Phoenix Market City', dist: '4.2 km', area: 'Viman Nagar' },
        { name: 'Pune Railway Station', dist: '8.5 km', area: 'Station Road' },
        { name: 'Hinjewadi Phase 1', dist: '12 km', area: 'IT Park' },
    ].filter(s => {
        if (!searchVal) return true // Show all as "Recent"
        return s.name.toLowerCase().includes(searchVal.toLowerCase())
    })

    const handleLocationSelect = (place: string) => {
        if (!place.trim()) return
        if (activeInput === 'pickup') {
            setPickup(place)
            setActiveInput('destination')
        } else {
            setDestination(place)
            setStep('options')
        }
    }

    return (
        <div className="relative h-screen w-full overflow-hidden bg-background font-sans select-none">

            {/* 1. INFINITE MAP BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <Map showUserLocation={step === 'search'} />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80 pointer-events-none" />
            </div>

            {/* Back Button (Floating) */}
            <div className="absolute top-12 left-6 z-50">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => step === 'search' ? router.back() : setStep('search')}
                    className="h-12 w-12 bg-charcoal/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white shadow-premium"
                >
                    <ArrowLeft className="h-6 w-6" />
                </motion.button>
            </div>

            <AnimatePresence mode="wait">
                {/* 2. SEARCH INTERFACE */}
                {step === 'search' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: 40 }}
                        className="absolute inset-x-0 bottom-0 z-30 p-6"
                    >
                        <div className="bg-background/90 backdrop-blur-3xl rounded-[3rem] p-8 shadow-premium border border-white/5 space-y-8">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-black tracking-tight text-white leading-tight">Plan your <br /><span className="text-primary italic">next journey</span></h1>
                                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest leading-none">
                                    {activeInput === 'pickup' ? "Step 1: Where should we pick you up?" : "Step 2: Where are you heading to?"}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Search Complex */}
                                <div className="bg-charcoal/50 rounded-[2rem] p-4 border border-white/5 space-y-3 relative">
                                    {/* Pickup Input */}
                                    <div className={`flex items-center gap-4 px-2 py-2 rounded-2xl transition-all ${activeInput === 'pickup' ? 'bg-white/5' : 'opacity-60'}`}>
                                        <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                        <Input
                                            autoComplete="off"
                                            placeholder="Set pickup location"
                                            value={pickup}
                                            onFocus={() => setActiveInput('pickup')}
                                            onChange={(e) => setPickup(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && pickup.trim() && setActiveInput('destination')}
                                            className="bg-transparent border-0 h-8 text-lg font-bold text-white placeholder:text-muted-foreground/30 focus-visible:ring-0 p-0"
                                        />
                                        {pickup && activeInput === 'pickup' && <X className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => setPickup("")} />}
                                    </div>

                                    <div className="h-[1px] bg-white/5 ml-6 mr-4" />

                                    {/* Destination Input */}
                                    <div className={`flex items-center gap-4 px-2 py-2 rounded-2xl transition-all ${activeInput === 'destination' ? 'bg-white/5' : 'opacity-60'}`}>
                                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(245,200,66,0.6)]" />
                                        <Input
                                            autoFocus={activeInput === 'destination'}
                                            autoComplete="off"
                                            placeholder="Enter destination..."
                                            value={destination}
                                            onFocus={() => setActiveInput('destination')}
                                            onChange={(e) => setDestination(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && destination.trim()) {
                                                    if (suggestions.length > 0) handleLocationSelect(suggestions[0].name)
                                                    else if (destination.length > 3) handleLocationSelect(destination)
                                                }
                                            }}
                                            className="bg-transparent border-0 h-8 text-lg font-bold text-white placeholder:text-muted-foreground/30 focus-visible:ring-0 p-0"
                                        />
                                        {destination && activeInput === 'destination' && <X className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => setDestination("")} />}
                                    </div>
                                </div>

                                {/* Recent / Suggestions */}
                                <div className="space-y-2 max-h-[240px] overflow-y-auto no-scrollbar pt-2">
                                    {suggestions.length > 0 ? (
                                        suggestions.map((place, i) => (
                                            <motion.button
                                                key={place.name}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                onClick={() => handleLocationSelect(place.name)}
                                                className="w-full flex items-center gap-4 p-4 hover:bg-charcoal/50 rounded-2xl transition-all group"
                                            >
                                                <div className="h-10 w-10 bg-charcoal rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                                    <MapPin className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <h4 className="font-bold text-white text-sm">{place.name}</h4>
                                                    <p className="text-[10px] font-medium text-muted-foreground truncate">{place.area} • {place.dist}</p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-zinc-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </motion.button>
                                        ))
                                    ) : (
                                        destination.length > 2 && (
                                            <div className="py-4">
                                                <Button
                                                    variant="secondary"
                                                    className="w-full h-16 rounded-2xl gap-2 font-black italic"
                                                    onClick={() => handleLocationSelect(destination)}
                                                >
                                                    <Navigation2 className="h-5 w-5 fill-primary text-primary" />
                                                    CONFIRM: "{destination}"
                                                </Button>
                                                <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-widest mt-4 opacity-50">Choose a location to continue</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 3. OPTIONS INTERFACE */}
                {step === 'options' && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="absolute inset-x-0 bottom-0 z-30 p-4 lg:p-6"
                    >
                        <div className="bg-background rounded-[3.5rem] p-8 shadow-premium border border-white/5 space-y-8 relative overflow-hidden">
                            {/* Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Ride Details</p>
                                    <h2 className="text-2xl font-black text-white truncate max-w-[200px]">{destination.split(',')[0]}</h2>
                                </div>
                                <div className="bg-charcoal/80 p-1.5 rounded-2xl flex border border-white/5">
                                    {[1, 2, 3, 4].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setPassengers(num)}
                                            className={`h-9 w-9 rounded-xl flex items-center justify-center gap-1 transition-all ${passengers === num ? 'bg-primary text-background font-black shadow-glow' : 'text-muted-foreground hover:text-white'}`}
                                        >
                                            <span className="text-xs">{num}</span>
                                            {num === 1 ? <User className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle Selection Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedVehicle('auto')}
                                    className={`p-5 rounded-3xl border-2 transition-all relative text-left group ${selectedVehicle === 'auto' ? 'border-primary bg-primary/5 shadow-glow' : 'border-white/5 bg-charcoal/20'}`}
                                >
                                    {selectedVehicle === 'auto' && (
                                        <div className="absolute -top-3 left-4 bg-primary text-background text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">Best Choice</div>
                                    )}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${selectedVehicle === 'auto' ? 'bg-primary text-background' : 'bg-charcoal text-muted-foreground'}`}>
                                            <CarFront className="h-7 w-7" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-muted-foreground leading-none">ETA</p>
                                            <p className="font-black text-white text-sm">2 MIN</p>
                                        </div>
                                    </div>
                                    <h4 className="font-black text-white">Smarth Auto</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Wait: Local Partner</p>
                                </motion.button>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedVehicle('prime')}
                                    className={`p-5 rounded-3xl border-2 transition-all relative text-left group ${selectedVehicle === 'prime' ? 'border-primary bg-primary/5 shadow-glow' : 'border-white/5 bg-charcoal/20'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${selectedVehicle === 'prime' ? 'bg-primary text-background' : 'bg-charcoal text-muted-foreground'}`}>
                                            <Sparkles className="h-7 w-7" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-muted-foreground leading-none">ETA</p>
                                            <p className="font-black text-white text-sm">5 MIN</p>
                                        </div>
                                    </div>
                                    <h4 className="font-black text-white">Smarth Prime</h4>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Elite Service</p>
                                </motion.button>
                            </div>

                            {/* Farewell/Offer Section */}
                            <div className="bg-charcoal/40 border border-white/5 p-4 rounded-[2.5rem] flex items-center justify-between">
                                <div className="pl-4">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Estimated Fare</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-4xl font-black text-white tracking-tighter">₹{fare}</span>
                                        <div className="h-6 w-[1px] bg-white/10" />
                                        <div className="flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-lg border border-green-500/20">
                                            <ShieldCheck className="h-3 w-3 text-green-500" />
                                            <span className="text-[9px] font-black text-green-500 uppercase">Fixed Price</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => setBaseFare(prev => prev + 5)}
                                        className="h-10 w-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-colors"
                                    >
                                        <span className="font-black">+</span>
                                    </button>
                                    <button
                                        onClick={() => setBaseFare(prev => Math.max(10, prev - 5))}
                                        className="h-10 w-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-white transition-colors"
                                    >
                                        <span className="font-black">-</span>
                                    </button>
                                </div>
                            </div>

                            {/* Main CTA */}
                            <Button
                                variant="premium"
                                className="w-full h-20 text-2xl font-black rounded-[2rem] shadow-glow group relative overflow-hidden active:scale-[0.97]"
                                onClick={() => router.push('/passenger/tracking')}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <span>CONFIRM RIDE</span>
                                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                                        <ArrowRight className="h-8 w-8" />
                                    </motion.div>
                                </div>
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Info Bar */}
            <div className="absolute top-12 right-6 z-50">
                <div className="glass px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-premium">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Secure Line</span>
                </div>
            </div>

        </div>
    )
}
