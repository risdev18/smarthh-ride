"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    ArrowLeft,
    Clock,
    MapPin,
    Search,
    Navigation2,
    X,
    CarFront,
    ChevronRight,
    Sparkles,
    Star,
    History,
    Home,
    Briefcase,
    ShieldCheck,
    PhoneCall,
    Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { rideService } from "@/lib/services/rideService"
import { useUserStore } from "@/lib/store/useUserStore"

// Dynamic Map
const Map = dynamic(() => import("@/components/map/MapComponent"), { ssr: false })

export default function BookRide() {
    const router = useRouter()
    const { user } = useUserStore()
    const [step, setStep] = useState<'search' | 'estimate'>('search')
    const [offer, setOffer] = useState(85)
    const [loading, setLoading] = useState(false)

    // Input States
    const [pickup, setPickup] = useState("Shivaji Nagar, Pune")
    const [destination, setDestination] = useState("")
    const [passengers, setPassengers] = useState(1)
    const [landmark, setLandmark] = useState("")

    const handleConfirm = async () => {
        if (!user) return
        setLoading(true)
        try {
            const rideId = await rideService.createRideRequest({
                passengerId: user.id || "",
                passengerName: user.name,
                passengerPhone: user.phone,
                pickup: {
                    address: pickup + (landmark ? ` (Near ${landmark})` : ""),
                    lat: 18.5204 + (Math.random() * 0.01 - 0.005),
                    lng: 73.8567 + (Math.random() * 0.01 - 0.005)
                },
                drop: {
                    address: destination,
                    lat: 18.5204 + (Math.random() * 0.04 - 0.02),
                    lng: 73.8567 + (Math.random() * 0.04 - 0.02)
                },
                fare: offer,
                passengers: passengers
            })
            router.push(`/passenger/tracking?rideId=${rideId}`)
        } catch (e) {
            alert("Error requesting ride")
            setLoading(false)
        }
    }

    const handleCallDriver = () => {
        alert("Connecting you to a nearby driver...");
    };

    if (!user) return null

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-950 font-sans">
            {/* PERSISTENT MAP BACKGROUND */}
            <div className="absolute inset-0 z-0">
                <Map />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 pointer-events-none"></div>
            </div>

            {/* TOP NAVIGATION */}
            <header className="absolute top-0 inset-x-0 z-50 p-4 sm:p-6 flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-2xl h-12 w-12 bg-white/10 backdrop-blur-xl border border-white/10 text-white active:scale-90"
                    onClick={() => step === 'estimate' ? setStep('search') : router.back()}
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 py-2 px-4 rounded-full flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3 text-primary animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">SafeRide Enabled</span>
                </div>
            </header>

            {/* SEARCH SHEET */}
            <AnimatePresence mode="wait">
                {step === 'search' && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="absolute inset-x-0 bottom-0 h-[88vh] bg-white rounded-t-[2.5rem] sm:rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] z-20 flex flex-col p-6 sm:p-10 overflow-hidden"
                    >
                        {/* Drag Handle for visual cue */}
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 shrink-0" />

                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
                            {/* Header */}
                            <div className="space-y-1">
                                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Find Your Ride</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Premium Local Mobility Direct to You</p>
                            </div>

                            {/* Input Container */}
                            <div className="bg-slate-50 rounded-[2rem] p-5 sm:p-8 border border-slate-100 shadow-inner relative space-y-4">
                                {/* Connector Line */}
                                <div className="absolute left-[33px] sm:left-[45px] top-[45px] sm:top-[60px] bottom-[48px] sm:bottom-[65px] w-[2px] bg-slate-200 dashed-border"></div>

                                {/* Pickup Row */}
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-green-500 ring-4 ring-green-100 shrink-0"></div>
                                    <div className="flex-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pickup Hub</p>
                                        <input
                                            value={pickup}
                                            onChange={(e) => setPickup(e.target.value)}
                                            className="w-full bg-transparent border-0 p-0 text-slate-900 font-bold text-base sm:text-lg focus:ring-0 placeholder:text-slate-300 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Landmark Row */}
                                <div className="ml-8 sm:ml-10">
                                    <input
                                        placeholder="Nearest Landmark (Temple, Shop, Square)"
                                        value={landmark}
                                        onChange={(e) => setLandmark(e.target.value)}
                                        className="w-full bg-white border border-slate-100 h-10 px-4 text-slate-600 font-bold text-xs sm:text-sm focus:border-slate-300 placeholder:text-slate-300 rounded-xl shadow-sm outline-none transition-all"
                                    />
                                </div>

                                <div className="h-px bg-slate-200 ml-8 sm:ml-10"></div>

                                {/* Destination Row */}
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-primary ring-4 ring-primary/20 shrink-0"></div>
                                    <div className="flex-1 flex items-center gap-2">
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Target Hub</p>
                                            <input
                                                autoFocus
                                                placeholder="Where shall we go?"
                                                value={destination}
                                                onChange={(e) => setDestination(e.target.value)}
                                                className="w-full bg-transparent border-0 p-0 text-slate-900 font-black text-xl sm:text-2xl focus:ring-0 placeholder:text-slate-200 italic outline-none"
                                            />
                                        </div>
                                        {destination && (
                                            <button
                                                onClick={() => setStep('estimate')}
                                                className="h-12 px-6 bg-primary text-black font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2 animate-fade-in"
                                            >
                                                Next <ChevronRight className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Save & History Section */}
                            <div className="space-y-8 pb-10">
                                <section className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                                        <History className="h-3.5 w-3.5" /> Recent Destinations
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { icon: Home, label: 'Home', addr: 'Kothrud, Pune' },
                                            { icon: Briefcase, label: 'Office', addr: 'Magarpatta City' }
                                        ].map((place, i) => (
                                            <button key={i} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:bg-slate-100 transition-all text-left group">
                                                <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-900 shadow-sm group-hover:scale-110 transition-transform">
                                                    <place.icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="font-black text-xs sm:text-sm text-slate-900 truncate uppercase tracking-tight">{place.label}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{place.addr}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                                        <Navigation2 className="h-3.5 w-3.5" /> Nearby Interest Hubs
                                    </h3>
                                    <div className="space-y-2">
                                        {[
                                            { name: 'Phoenix Market City', area: 'Viman Nagar', dist: '4.2 km' },
                                            { name: 'Pavilion Mall', area: 'SB Road', dist: '5.1 km' }
                                        ].map((loc, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setDestination(loc.name); setStep('estimate'); }}
                                                className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                                                        <MapPin className="h-5 w-5" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-black uppercase tracking-tight italic">{loc.name}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{loc.area} • {loc.dist}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-primary transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ESTIMATE SHEET */}
            <AnimatePresence>
                {step === 'estimate' && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="absolute inset-x-0 bottom-0 bg-white rounded-t-[2.5rem] sm:rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] z-30 flex flex-col p-6 sm:p-10 pt-4"
                    >
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 shrink-0" />

                        <div className="overflow-y-auto no-scrollbar space-y-6 sm:space-y-8 pb-8">
                            {/* Trip Summary Header */}
                            <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg">
                                        <CarFront className="h-3 w-3 text-primary" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Global Utility Auto</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none balance-text">{destination.split(',')[0]}</h2>
                                </div>
                                <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-4 sm:p-0 bg-slate-50 sm:bg-transparent rounded-[1.5rem] border sm:border-0 border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Estimate</p>
                                    <h3 className="text-4xl sm:text-6xl font-black text-slate-900 italic tracking-tighter leading-none">
                                        <span className="text-xl sm:text-2xl text-slate-300 mr-1 italic">₹</span>{offer}
                                    </h3>
                                </div>
                            </div>

                            {/* Passenger Selector */}
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 w-fit">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 border-r border-slate-200">Load Factor</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setPassengers(n)}
                                            className={`h-9 w-9 rounded-xl font-black text-sm transition-all shadow-sm ${passengers === n ? 'bg-slate-950 text-primary' : 'bg-white text-slate-400 border border-slate-100'}`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Transaction Core: Negotiation */}
                            <div className="bg-slate-900 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Sparkles className="h-24 w-24 text-white" />
                                </div>

                                <div className="relative z-10 space-y-6">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                            <Sparkles className="h-3 w-3 text-primary animate-pulse" /> Negotiate Bid
                                        </p>
                                        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                                            {[offer - 10, offer, offer + 10, offer + 20].map((bid) => (
                                                <button
                                                    key={bid}
                                                    onClick={() => setOffer(bid)}
                                                    className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all ${offer === bid ? 'bg-primary text-black scale-105' : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'}`}
                                                >
                                                    ₹{bid}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Custom Settlement</p>
                                            <div className="flex items-baseline">
                                                <span className="text-xl sm:text-2xl font-black text-slate-600 italic mr-2">₹</span>
                                                <input
                                                    type="number"
                                                    value={offer}
                                                    onChange={(e) => setOffer(Number(e.target.value))}
                                                    className="bg-transparent text-4xl sm:text-5xl font-black text-white w-full outline-none italic tracking-tighter"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 text-xl font-black text-white hover:bg-white/10 active:scale-90 transition-all"
                                                onClick={() => setOffer(Math.max(10, offer - 5))}
                                            >
                                                -
                                            </button>
                                            <button
                                                className="h-14 w-14 rounded-2xl bg-primary text-xl font-black text-black hover:bg-primary/90 active:scale-90 transition-all shadow-lg shadow-primary/20"
                                                onClick={() => setOffer(offer + 5)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Final Action Hub */}
                            <div className="space-y-4 pt-2">
                                <button
                                    onClick={handleCallDriver}
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-colors group"
                                >
                                    <PhoneCall className="h-4 w-4 group-hover:animate-bounce" /> Connect to Nearby Pilot Now
                                </button>

                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className="w-full h-20 bg-slate-950 hover:bg-black text-white rounded-[2rem] font-black text-xl sm:text-2xl uppercase tracking-tighter shadow-2xl shadow-slate-950/40 relative overflow-hidden group active:scale-[0.98] transition-all"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-4">
                                        {loading ? (
                                            <Loader2 className="animate-spin h-8 w-8 text-primary" />
                                        ) : (
                                            <>
                                                DEPLOY RIDE REQUEST
                                                <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 group-hover:translate-x-2 transition-transform text-primary" />
                                            </>
                                        )}
                                    </div>
                                    {/* Accent pulse animation inner */}
                                    {!loading && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
