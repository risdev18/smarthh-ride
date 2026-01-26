"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store/useUserStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, IndianRupee, TrendingUp, Calendar, Clock, ChevronRight, BarChart3, Wallet, Download } from "lucide-react"
import { motion } from "framer-motion"

export default function DriverEarnings() {
    const router = useRouter()
    const { user } = useUserStore()

    const [stats] = useState({
        today: 845,
        weekly: 5620,
        monthly: 24800,
        totalRides: 156
    })

    const recentPayouts = [
        { date: "24 Jan 2026", amount: 720, rides: 10, status: "Transferred" },
        { date: "23 Jan 2026", amount: 950, rides: 14, status: "Transferred" },
        { date: "22 Jan 2026", amount: 640, rides: 8, status: "Transferred" }
    ]

    return (
        <div className="min-h-screen bg-background text-white p-6 pb-20 font-sans">
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
                    <h1 className="text-3xl font-black italic tracking-tight">Earning <span className="text-primary not-italic">Hub</span></h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Track your growth with Samarth</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Main Stats Card */}
                <Card className="rounded-[3.5rem] bg-surface/40 border-white/5 p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-all">
                        <Wallet className="h-32 w-32" />
                    </div>

                    <div className="space-y-1 mb-8">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Today's Earnings</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black italic tracking-tighter">₹{stats.today}</span>
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-glow shadow-green-500/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Weekly</p>
                            <p className="text-xl font-black italic">₹{stats.weekly}</p>
                        </div>
                        <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Monthly</p>
                            <p className="text-xl font-black italic">₹{stats.monthly}</p>
                        </div>
                    </div>
                </Card>

                {/* Growth Insights */}
                <div className="grid grid-cols-2 gap-4">
                    <Card className="rounded-[2.5rem] bg-green-500/10 border-green-500/20 p-6 flex flex-col justify-between h-40">
                        <TrendingUp className="h-8 w-8 text-green-500" />
                        <div>
                            <p className="text-[10px] font-black text-green-500 uppercase tracking-widest leading-none mb-1">+12% Since</p>
                            <h4 className="text-lg font-black text-white italic">Last Week</h4>
                        </div>
                    </Card>
                    <Card className="rounded-[2.5rem] bg-blue-500/10 border-blue-500/20 p-6 flex flex-col justify-between h-40">
                        <BarChart3 className="h-8 w-8 text-blue-500" />
                        <div>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">Total Rides</p>
                            <h4 className="text-lg font-black text-white italic">{stats.totalRides} Done</h4>
                        </div>
                    </Card>
                </div>

                {/* Recent Payouts */}
                <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center px-4">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Daily Reports</h4>
                        <Button variant="ghost" className="text-[9px] font-black text-primary uppercase tracking-widest gap-2">
                            <Download className="h-3 w-3" /> Statement
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {recentPayouts.map((payout, i) => (
                            <motion.div
                                key={payout.date}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="rounded-3xl border-white/5 bg-surface p-5 flex items-center justify-between border-l-4 border-l-green-500 shadow-premium">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-muted-foreground">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white tracking-tight italic">{payout.date}</p>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{payout.rides} Rides Completed</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-primary italic leading-none mb-1">₹{payout.amount}</p>
                                        <p className="text-[8px] font-black uppercase text-green-500 tracking-widest">{payout.status}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/10 mt-20 italic">Smarth Ride Partner Network v1.0</p>
        </div>
    )
}
