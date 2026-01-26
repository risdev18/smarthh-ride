"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store/useUserStore"
import { rideService, Ride } from "@/lib/services/rideService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, History, MapPin, IndianRupee, Clock, ChevronRight, RefreshCw, Navigation } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PassengerHistory() {
    const router = useRouter()
    const { user } = useUserStore()
    const [rides, setRides] = useState<Ride[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user?.id) {
            fetchHistory()
        }
    }, [user?.id])

    const fetchHistory = async () => {
        setLoading(true)
        if (user?.id) {
            const data = await rideService.getPassengerHistory(user.id)
            setRides(data)
        }
        setLoading(false)
    }

    const handleRebook = (ride: Ride) => {
        // Logic to pre-fill book ride page
        router.push(`/passenger/book?pickup=${encodeURIComponent(ride.pickup)}&drop=${encodeURIComponent(ride.drop)}`)
    }

    return (
        <div className="min-h-screen bg-background text-white p-6 pb-20 font-sans">
            {/* Header */}
            <div className="flex items-center gap-6 mb-10 bg-surface/30 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight">My <span className="text-primary not-italic">Rides</span></h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Your journey history with Samarth</p>
                </div>
            </div>

            {loading ? (
                <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                    <RefreshCw className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Loading History...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {rides.length > 0 ? rides.map((ride, i) => (
                            <motion.div
                                key={ride.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="rounded-[2.5rem] border-white/5 bg-surface/40 overflow-hidden group">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Navigation className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">
                                                        {ride.createdAt ? new Date(ride.createdAt.seconds * 1000).toLocaleDateString() : 'Today'}
                                                    </p>
                                                    <h3 className="text-lg font-black italic">{ride.driverName || "Smarth Partner"}</h3>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center justify-end gap-1 text-primary mb-1">
                                                    <IndianRupee className="h-4 w-4" />
                                                    <span className="text-xl font-black">₹{ride.fare}</span>
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${ride.status === 'completed' ? 'text-green-500 border-green-500/20 bg-green-500/10' : 'text-alert border-alert/20 bg-alert/10'
                                                    }`}>
                                                    {ride.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6 relative">
                                            <div className="absolute left-1.5 top-3 bottom-3 w-0.5 bg-white/5" />
                                            <div className="flex items-center gap-4">
                                                <div className="h-3 w-3 rounded-full bg-primary relative z-10 shadow-glow-sm" />
                                                <p className="text-xs font-bold text-white/70 truncate">{ride.pickup}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="h-3 w-3 rounded-full bg-alert relative z-10" />
                                                <p className="text-sm font-black text-white truncate">{ride.drop}</p>
                                            </div>
                                        </div>

                                        <Button
                                            variant="secondary"
                                            className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest gap-2 bg-white/5 hover:bg-white/10 border border-white/5"
                                            onClick={() => handleRebook(ride)}
                                        >
                                            <RefreshCw className="h-4 w-4" /> Re-Book This Ride
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )) : (
                            <div className="h-[50vh] flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-white/5 rounded-[4rem] bg-surface/20">
                                <History className="h-16 w-16 text-white/5 mb-6" />
                                <h2 className="text-xl font-black italic text-white/40 uppercase tracking-widest">No Rides Yet</h2>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 max-w-[200px]">Start your first journey with Samarth Ride today!</p>
                                <Button
                                    className="mt-8 rounded-2xl h-14 px-8 font-black uppercase tracking-widest"
                                    onClick={() => router.push('/passenger/book')}
                                >
                                    Book Now
                                </Button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
