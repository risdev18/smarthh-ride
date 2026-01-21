"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Navigation, MapPin, IndianRupee, Clock, Timer, ArrowRight, ShieldCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function IncomingRideRequest({
    onAccept,
    onReject
}: {
    onAccept: () => void,
    onReject: () => void
}) {
    const [timeLeft, setTimeLeft] = useState(15)
    const totalTime = 15

    useEffect(() => {
        if (timeLeft <= 0) {
            onReject()
            return
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
        return () => clearInterval(timer)
    }, [timeLeft, onReject])

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-background/40 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full max-w-sm bg-background border border-white/5 rounded-[3.5rem] shadow-premium relative overflow-hidden"
            >
                {/* Visual Header / Timer */}
                <div className="bg-charcoal p-8 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className="relative h-20 w-20 flex items-center justify-center">
                            <svg className="absolute inset-0 h-full w-full -rotate-90">
                                <circle
                                    cx="40" cy="40" r="36"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="text-white/5"
                                />
                                <motion.circle
                                    cx="40" cy="40" r="36"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeDasharray="226.2"
                                    animate={{ strokeDashoffset: 226.2 - (226.2 * timeLeft / totalTime) }}
                                    className="text-primary"
                                />
                            </svg>
                            <span className="text-2xl font-black text-white italic">{timeLeft}s</span>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-white italic tracking-tight">Incoming <span className="text-primary not-italic">Request</span></h2>
                            <div className="flex items-center justify-center gap-1.5 text-primary/60 mt-1">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Partner Advantage</span>
                            </div>
                        </div>
                    </div>
                    {/* Abstract Grid Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                </div>

                <div className="p-8 space-y-8">
                    {/* Fare & Metrics */}
                    <div className="flex justify-between items-end pb-2">
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Estimated Fare</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-primary">₹</span>
                                <span className="text-5xl font-black text-white tracking-tighter">145</span>
                            </div>
                        </div>
                        <div className="text-right space-y-1">
                            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full inline-block">
                                <span className="text-[10px] font-black text-primary tracking-tighter">PREMIUM RIDE</span>
                            </div>
                            <p className="text-xs font-bold text-white italic">4.2 km total</p>
                        </div>
                    </div>

                    {/* Route */}
                    <div className="space-y-6 relative">
                        <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-dashed border-l-2 border-dashed border-white/10" />

                        <div className="flex gap-5 relative">
                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-glow">
                                <div className="h-2 w-2 bg-background rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Pickup</p>
                                <p className="font-bold text-white truncate text-lg leading-none">Hanuman Mandir, Main Road</p>
                                <p className="text-[10px] font-bold text-primary/80 uppercase mt-1">800m away • 2 min</p>
                            </div>
                        </div>

                        <div className="flex gap-5 relative">
                            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                <div className="h-2 w-2 bg-white rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Destination</p>
                                <p className="font-bold text-white truncate text-lg leading-none">Shivaji Nagar Station</p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onReject}
                            className="flex-1 h-16 rounded-2xl bg-charcoal text-white border border-white/5 font-black uppercase text-xs tracking-widest hover:bg-white/5 transition-all"
                        >
                            Decline
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onAccept}
                            className="flex-[2] h-20 rounded-3xl bg-primary text-background font-black uppercase text-xl shadow-glow relative overflow-hidden group"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                Accept Ride <ArrowRight className="h-6 w-6 stroke-[3px]" />
                            </div>
                            {/* Reflection effect */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                            />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
