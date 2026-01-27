"use client"

import { useState, useEffect } from "react"
import { passengerService, PassengerData } from "@/lib/services/passengerService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Users,
    Search,
    User,
    Mail,
    Phone,
    Trash2,
    Calendar,
    ArrowUpRight,
    ArrowLeft,
    Filter,
    ShieldAlert,
    Clock,
    UserCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminPassengersPage() {
    const [passengers, setPassengers] = useState<PassengerData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPassenger, setSelectedPassenger] = useState<PassengerData | null>(null)
    const [isMobileView, setIsMobileView] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobileView(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const unsubscribe = passengerService.listenToPassengers((data) => {
            setPassengers(data)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this passenger? This action is IRREVERSIBLE.")) return
        try {
            await passengerService.deletePassenger(id)
            setSelectedPassenger(null)
        } catch (e: any) {
            alert("Error: " + e.message)
        }
    }

    const filtered = passengers.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="space-y-6 sm:space-y-10 pb-20 max-w-[1600px] mx-auto">
            {/* Stats Header */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Base', value: passengers.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'New This Week', value: '+124', icon: Calendar, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Active Sessions', value: '84', icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Verified', value: '100%', icon: ShieldAlert, color: 'text-slate-500', bg: 'bg-slate-500/10' }
                ].map((stat, i) => (
                    <Card key={i} className="bg-slate-900/40 border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden group shadow-2xl">
                        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                            <div className={`h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <stat.icon className="h-5 w-5 sm:h-7 sm:w-7" />
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none mb-1">{stat.label}</p>
                                <p className="text-xl sm:text-3xl font-black tracking-tighter text-white">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">
                {/* Search and List */}
                <div className={`flex-1 w-full space-y-4 ${selectedPassenger && isMobileView ? 'hidden' : 'block'}`}>
                    <div className="bg-slate-950 border border-white/5 p-4 sm:p-6 rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl space-y-6">
                        <div className="flex items-center gap-4 bg-slate-900/60 border border-white/5 p-2 pl-5 rounded-2xl sm:rounded-[2rem]">
                            <Search className="h-5 w-5 text-slate-700" />
                            <input
                                placeholder="Search identification, phone or email..."
                                className="bg-transparent flex-1 outline-none font-bold text-xs sm:text-sm h-10 sm:h-12 text-white placeholder:text-slate-800"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
                            {filtered.map(p => (
                                <motion.div
                                    layoutId={p.id}
                                    key={p.id}
                                    onClick={() => setSelectedPassenger(p)}
                                    className={`flex items-center gap-4 p-4 sm:p-5 bg-slate-950 border transition-all cursor-pointer rounded-2xl sm:rounded-3xl ${selectedPassenger?.id === p.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-[0_0_40px_rgba(31,255,255,0.05)]' : 'border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="h-10 w-10 sm:h-14 sm:w-14 bg-slate-900 rounded-xl sm:rounded-2xl border border-white/5 flex items-center justify-center">
                                        <UserCircle className="h-6 w-6 sm:h-8 sm:w-8 text-slate-700" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm sm:text-lg font-black text-white uppercase tracking-tight truncate">{p.name}</h3>
                                        <p className="text-[10px] sm:text-xs text-slate-600 font-bold uppercase tracking-widest">{p.phone}</p>
                                    </div>
                                    <ArrowUpRight className={`h-4 w-4 sm:h-5 sm:w-5 ${selectedPassenger?.id === p.id ? 'text-primary' : 'text-slate-800'}`} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className={`w-full lg:w-[460px] lg:sticky lg:top-8 ${selectedPassenger ? 'block' : 'hidden lg:block'}`}>
                    {selectedPassenger ? (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                            <Card className="bg-slate-900 border border-white/5 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden ring-1 ring-white/5">
                                <div className="h-24 sm:h-32 bg-slate-950 p-6 flex justify-between items-start">
                                    <button
                                        onClick={() => setSelectedPassenger(null)}
                                        className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                    >
                                        <Calendar className="h-5 w-5" />
                                    </button>
                                    <div className="h-20 w-20 sm:h-24 sm:w-24 bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border-4 border-slate-950 shadow-2xl flex items-center justify-center -mb-20">
                                        <User className="h-10 w-10 sm:h-12 sm:w-12 text-slate-700" />
                                    </div>
                                    <button
                                        onClick={() => handleDelete(selectedPassenger.id!)}
                                        className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-black transition-all"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>

                                <CardContent className="pt-16 sm:pt-20 pb-10 px-6 sm:px-12 space-y-10 sm:space-y-12">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Passenger Profile</p>
                                        <h2 className="text-2xl sm:text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedPassenger.name}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="bg-slate-950 p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                                            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <Phone className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Mobile Access</p>
                                                <p className="text-lg font-black text-white">{selectedPassenger.phone}</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-950 p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                                            <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Email ID</p>
                                                <p className="text-lg font-black text-white truncate">{selectedPassenger.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5">
                                        <div className="flex items-center justify-between mb-8">
                                            <h4 className="text-[10px] font-black uppercase text-slate-600 tracking-[0.4em]">Protocol History</h4>
                                            <span className="text-[10px] font-black text-primary uppercase">v4.0 Hub</span>
                                        </div>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Registered on Hub', val: new Date(selectedPassenger.createdAt?.toDate?.() || selectedPassenger.createdAt).toLocaleDateString() },
                                                { label: 'Role Authority', val: 'Level 1 Passenger' },
                                                { label: 'Account Integrity', val: 'Verified' }
                                            ].map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-[10px] sm:text-xs">
                                                    <span className="font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                                                    <span className="font-black text-white uppercase italic">{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedPassenger(null)}
                                        className="w-full h-16 bg-white text-black font-black uppercase rounded-2xl sm:rounded-3xl text-[10px] tracking-[0.4em] active:scale-95 transition-all shadow-xl shadow-white/5"
                                    >
                                        RETURN TO GRID
                                    </button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <div className="hidden lg:flex h-[600px] flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3.5rem] text-slate-800 space-y-6 bg-slate-900/10">
                            <div className="h-20 w-20 rounded-[2.5rem] bg-slate-900 border border-white/5 flex items-center justify-center animate-pulse">
                                <Users className="h-10 w-10 text-slate-800" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="font-black uppercase tracking-[0.4em] text-xs">Pilot Sync Offline</p>
                                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Select user profile to initialize sync</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
