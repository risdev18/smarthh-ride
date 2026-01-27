"use client"

import { useState, useEffect } from "react"
import { rideService, RideRequest } from "@/lib/services/rideService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Map,
    Search,
    Navigation,
    Circle,
    ArrowUpRight,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    User,
    Car,
    Activity,
    Calendar,
    ChevronLeft,
    RefreshCw,
    MapPin,
    AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminRidesPage() {
    const [rides, setRides] = useState<RideRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRide, setSelectedRide] = useState<RideRequest | null>(null)
    const [isMobileView, setIsMobileView] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobileView(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const unsubscribe = rideService.listenToAllRides((data) => {
            setRides(data)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const filtered = rides.filter(r =>
        r.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.driverName && r.driverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.id?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-500 bg-green-500/10'
            case 'accepted':
            case 'started': return 'text-primary bg-primary/10'
            case 'pending': return 'text-yellow-500 bg-yellow-500/10'
            case 'cancelled': return 'text-red-500 bg-red-500/10'
            default: return 'text-slate-500 bg-slate-500/10'
        }
    }

    return (
        <div className="space-y-6 sm:space-y-10 pb-20 max-w-[1600px] mx-auto">
            {/* Command HUD */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl sm:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">Logistics <br /> <span className="text-primary">Stream</span></h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Active Asset Distribution Monitor</p>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-4 bg-slate-900 border border-white/5 p-2 pl-5 rounded-2xl sm:rounded-[2rem] w-full sm:w-80">
                        <Search className="h-5 w-5 text-slate-700" />
                        <input
                            placeholder="Find SR-ID or Profile..."
                            className="bg-transparent flex-1 outline-none font-bold text-xs text-white placeholder:text-slate-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">
                {/* Timeline and List */}
                <div className={`flex-1 w-full space-y-4 ${selectedRide && isMobileView ? 'hidden' : 'block'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                        {filtered.map(r => (
                            <motion.div
                                layoutId={r.id}
                                key={r.id}
                                onClick={() => setSelectedRide(r)}
                                className={`group p-4 sm:p-6 bg-slate-900/40 border transition-all cursor-pointer rounded-[1.5rem] sm:rounded-[2.5rem] ${selectedRide?.id === r.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-2xl' : 'border-white/5 hover:border-white/10'}`}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-950 rounded-2xl border border-white/5 flex items-center justify-center">
                                            <Activity className={`h-5 w-5 sm:h-6 sm:w-6 ${r.status === 'completed' ? 'text-green-500' : 'text-primary animate-pulse'}`} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">ID: SR-{r.id?.slice(-6).toUpperCase()}</p>
                                            <h3 className="text-sm sm:text-lg font-black text-white uppercase italic tracking-tight">{r.passengerName}</h3>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-white/5 ${getStatusColor(r.status)}`}>
                                        {r.status}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Pilot Assigned</p>
                                        <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase italic truncate">{r.driverName || 'SCANNING...'}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Credential Fare</p>
                                        <p className="text-sm sm:text-lg font-black text-white italic">₹{r.fare}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Detail Viewport */}
                <div className={`w-full lg:w-[500px] lg:sticky lg:top-8 ${selectedRide ? 'block' : 'hidden lg:block'}`}>
                    {selectedRide ? (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                            <Card className="bg-slate-900 border border-white/5 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden ring-1 ring-white/5">
                                <div className="p-6 sm:p-10 space-y-10">
                                    <div className="flex justify-between items-start">
                                        <button
                                            onClick={() => setSelectedRide(null)}
                                            className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 leading-none">LOGISTICS ID</p>
                                            <p className="text-lg font-black text-white tracking-widest">SR-{selectedRide.id?.toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="hidden sm:flex flex-col items-center gap-2">
                                                    <Circle className="h-3 w-3 text-primary fill-primary" />
                                                    <div className="w-0.5 h-16 bg-slate-800" />
                                                    <Navigation className="h-4 w-4 text-green-500 fill-green-500" />
                                                </div>
                                                <div className="space-y-8 flex-1">
                                                    <div>
                                                        <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-2 leading-none">Origin Hub</p>
                                                        <p className="text-xs sm:text-sm font-bold text-white uppercase italic leading-tight">{selectedRide.pickup.address}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black text-green-500 uppercase tracking-[0.3em] mb-2 leading-none">Target Vector</p>
                                                        <p className="text-xs sm:text-sm font-bold text-white uppercase italic leading-tight">{selectedRide.drop.address}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-950/60 p-5 rounded-[2rem] border border-white/5">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <User className="h-4 w-4 text-slate-700" />
                                                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Passenger</p>
                                                </div>
                                                <p className="text-xs sm:text-sm font-black text-white italic truncate">{selectedRide.passengerName}</p>
                                                <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-widest">{selectedRide.passengerPhone}</p>
                                            </div>
                                            <div className="bg-slate-950/60 p-5 rounded-[2rem] border border-white/5">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Car className="h-4 w-4 text-slate-700" />
                                                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Pilot Asset</p>
                                                </div>
                                                <p className="text-xs sm:text-sm font-black text-primary italic truncate">{selectedRide.driverName || 'UNASSIGNED'}</p>
                                                <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-widest">{selectedRide.driverVehicleNumber || 'SCANNING...'}</p>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Status Protocol</p>
                                                <p className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedRide.status}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Grid Fare</p>
                                                <p className="text-3xl font-black text-primary italic tracking-tighter">₹{selectedRide.fare}</p>
                                            </div>
                                        </div>

                                        <button className="w-full h-16 sm:h-20 bg-white text-black font-black uppercase rounded-2xl sm:rounded-[2.5rem] tracking-[0.3em] text-[10px] sm:text-xs shadow-xl active:scale-95 transition-all">
                                            INITIALIZE OVERRIDE
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ) : (
                        <div className="hidden lg:flex h-[600px] flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem] text-slate-900 bg-slate-950/30">
                            <div className="h-20 w-20 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-center mb-6">
                                <Activity className="h-10 w-10 text-slate-800" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-700 mb-2">Protocol Pending</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Select logistics stream for inspection</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
