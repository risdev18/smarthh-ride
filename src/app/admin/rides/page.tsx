"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { adminService } from "@/lib/services/adminService"
import { Navigation, Loader2, ArrowLeft, Search, Calendar, MapPin, IndianRupee, Clock, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function AllRidesPage() {
    const router = useRouter()
    const [rides, setRides] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchRides()
    }, [])

    const fetchRides = async () => {
        setLoading(true)
        try {
            const data = await adminService.getAllRides(100) // Fetch up to 100 rides
            setRides(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const filteredRides = rides.filter(ride =>
        ride.passengerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.driverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.pickup?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ride.drop?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Accessing System Trip Logs...</p>
        </div>
    )

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-surface/30 p-8 rounded-[3rem] border border-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-black text-white italic tracking-tight">Trip <span className="text-primary not-italic">Logs</span></h1>
                        <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1 italic">Comprehensive history of Smarth Network activity</p>
                    </div>
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH PASSENGER, DRIVER OR ROUTE..."
                        className="w-full h-14 bg-charcoal/50 border border-white/5 rounded-2xl pl-14 pr-6 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/30 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredRides.length > 0 ? filteredRides.map((ride, i) => (
                        <motion.div
                            key={ride.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                        >
                            <Card className="rounded-[2.5rem] border-white/5 bg-surface/40 hover:bg-white/5 transition-all overflow-hidden group">
                                <CardContent className="p-0">
                                    <div className="grid md:grid-cols-4 items-center">
                                        {/* info */}
                                        <div className="p-8 flex items-center gap-5 border-b md:border-b-0 md:border-r border-white/5">
                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg ${ride.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                ride.status === 'cancelled' ? 'bg-alert/10 text-alert' : 'bg-primary/10 text-primary'
                                                }`}>
                                                <Navigation className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Passenger</p>
                                                <h3 className="text-xl font-black text-white tracking-tight italic">{ride.passengerName || "Private User"}</h3>
                                            </div>
                                        </div>

                                        {/* Route */}
                                        <div className="p-8 md:col-span-2 space-y-3 border-b md:border-b-0 border-white/5">
                                            <div className="flex items-center gap-3 text-white/40 group-hover:text-primary transition-colors">
                                                <MapPin className="h-4 w-4" />
                                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">{ride.pickup}</p>
                                            </div>
                                            <div className="h-4 w-0.5 bg-white/5 ml-1.5" />
                                            <div className="flex items-center gap-3 text-white">
                                                <MapPin className="h-4 w-4 text-primary" />
                                                <p className="text-xs font-black uppercase tracking-tight">{ride.drop}</p>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="p-8 flex justify-between md:justify-end items-center gap-10">
                                            <div className="text-right space-y-2">
                                                <div className="flex items-center justify-end gap-2 text-primary">
                                                    <IndianRupee className="h-4 w-4" />
                                                    <span className="text-2xl font-black italic">₹{ride.fare}</span>
                                                </div>
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 ${ride.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        ride.status === 'cancelled' ? 'bg-alert/10 text-alert border-alert/20' : 'bg-primary/10 text-primary border-primary/20'
                                                        }`}>
                                                        {ride.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="bg-charcoal/30 px-8 py-3 flex flex-wrap gap-6 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                                {ride.createdAt ? new Date(ride.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                                {ride.createdAt ? new Date(ride.createdAt.seconds * 1000).toLocaleTimeString() : 'N/A'}
                                            </span>
                                        </div>
                                        {ride.driverName && (
                                            <div className="flex items-center gap-2">
                                                <User className="h-3.5 w-3.5 text-primary" />
                                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">Partner: {ride.driverName}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )) : (
                        <div className="h-60 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-[4rem]">
                            <Navigation className="h-12 w-12 mb-4 opacity-10" />
                            <p className="text-[11px] font-black uppercase tracking-widest">No matching logs found</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
