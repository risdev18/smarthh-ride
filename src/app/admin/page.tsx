"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/lib/store/useUserStore"
import {
    Users,
    Car,
    TrendingUp,
    ShieldCheck,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Map,
    History,
    RefreshCw,
    AlertTriangle,
    Zap,
    LayoutDashboard
} from "lucide-react"
import { motion } from "framer-motion"
import { dataPurgeService } from "@/lib/services/dataPurgeService"
import { driverService, DriverData } from "@/lib/services/driverService"
import { passengerService, PassengerData } from "@/lib/services/passengerService"
import { rideService, RideRequest } from "@/lib/services/rideService"

export default function AdminOverview() {
    const [drivers, setDrivers] = useState<DriverData[]>([])
    const [passengers, setPassengers] = useState<PassengerData[]>([])
    const [rides, setRides] = useState<RideRequest[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubDrivers = driverService.listenToDrivers((data) => setDrivers(data))
        const unsubPassengers = passengerService.listenToPassengers((data) => setPassengers(data))
        const unsubRides = rideService.listenToAllRides((data) => setRides(data))

        setLoading(false)

        return () => {
            unsubDrivers()
            unsubPassengers()
            unsubRides()
        }
    }, [])

    const totalRevenue = rides
        .filter(r => r.status === 'completed')
        .reduce((acc, curr) => acc + (curr.fare || 0), 0)

    const activeDrivers = drivers.filter(d => d.status === 'online').length
    const pendingApprovals = drivers.filter(d => d.status === 'pending').length

    const stats = [
        { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, trend: 'REALTIME', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Pilots (Online)', value: activeDrivers.toString(), trend: `${drivers.length} TOTAL`, icon: Car, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Passengers', value: passengers.length.toString(), trend: 'TOTAL', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Pending Approvals', value: pendingApprovals.toString(), trend: 'URGENT', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ]

    return (
        <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
            {/* Command Header */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1.5 w-8 bg-primary rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Operations Center</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase italic leading-[0.9]">
                        COMMAND <br /> <span className="text-slate-800">DASHBOARD</span>
                    </h1>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={async () => {
                            if (confirm("🚨 TERMINAL WARNING: Purge all application records? This action is irreversible.")) {
                                await dataPurgeService.clearAllAppData();
                                alert("GRID WIPED.");
                                window.location.reload();
                            }
                        }}
                        className="h-12 px-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all active:scale-95"
                    >
                        <AlertTriangle className="mr-2 h-4 w-4 inline" /> Purge Records
                    </button>
                    <div className="bg-slate-900 border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Grid Active</span>
                    </div>
                </div>
            </header>

            {/* Stats Pulse Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-slate-900/40 border-white/5 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-all shadow-2xl">
                            <CardContent className="p-5 sm:p-8">
                                <div className="flex justify-between items-start mb-6 sm:mb-8">
                                    <div className={`h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        <stat.icon className="h-5 w-5 sm:h-7 sm:w-7" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-[8px] sm:text-[10px] font-black px-2 py-0.5 rounded-md ${stat.bg} ${stat.color} bg-opacity-20`}>
                                        {stat.trend}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                                    <p className="text-2xl sm:text-4xl font-black tracking-tighter text-white">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-10">
                {/* Logistics Feed */}
                <Card className="xl:col-span-2 bg-slate-900 border-white/5 rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl overflow-hidden">
                    <CardHeader className="p-8 sm:p-12 pb-4 sm:pb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tight italic flex items-center gap-3 text-white">
                                    <Zap className="h-6 w-6 text-primary" /> REAL-TIME LOGISTICS
                                </CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mt-1">Live grid activity stream</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 sm:p-12 pt-0">
                        <div className="space-y-3 sm:space-y-4">
                            {rides.slice(0, 6).map((ride) => (
                                <div key={ride.id} className="flex items-center gap-4 p-4 sm:p-6 bg-slate-950 border border-white/5 rounded-2xl sm:rounded-3xl hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary/40 transition-colors">
                                        <Map className="h-6 w-6 text-slate-700 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-black text-white uppercase tracking-tight truncate">Asset: {ride.passengerName}</p>
                                        <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{ride.status.toUpperCase()} • {ride.pickup.address.slice(0, 20)}...</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm sm:text-lg font-black text-white italic">₹{ride.fare}</p>
                                        <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${ride.status === 'completed' ? 'text-green-500' : 'text-primary'}`}>{ride.status}</p>
                                    </div>
                                </div>
                            ))}
                            {rides.length === 0 && (
                                <div className="py-20 text-center text-slate-700 font-black uppercase tracking-widest text-xs">
                                    No active logs in the current sector
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* System Diagnostics */}
                <div className="space-y-6 sm:space-y-10">
                    <Card className="bg-slate-950 border border-white/5 rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl relative overflow-hidden group h-full">
                        <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none">
                            <ShieldCheck className="h-64 w-64 rotate-12" />
                        </div>
                        <CardContent className="p-8 sm:p-12 space-y-10">
                            <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">CORE <br /> DIAGNOSTICS</h3>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                                        <span>Inbound Signals</span>
                                        <span className="text-primary">{rides.length}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(rides.length * 2, 100)}%` }} className="h-full bg-primary" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                                        <span>Pilot Availability</span>
                                        <span className="text-green-500">{activeDrivers}/{drivers.length}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${(activeDrivers / (drivers.length || 1)) * 100}%` }} className="h-full bg-green-500" />
                                    </div>
                                </div>
                            </div>

                            <button className="w-full h-16 sm:h-20 bg-white text-black font-black uppercase rounded-2xl sm:rounded-3xl text-[10px] sm:text-xs tracking-[0.3em] active:scale-95 transition-all shadow-xl shadow-white/5">
                                INITIALIZE HEALTH CHECK
                            </button>
                        </CardContent>
                    </Card>

                    {/* Alerts Log */}
                    <Card className="bg-slate-900 border border-white/5 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <History className="h-5 w-5 text-slate-500" />
                            <h3 className="text-lg font-black uppercase tracking-tight italic text-white leading-none">SYSTEM PROTOCOLS</h3>
                        </div>
                        <div className="space-y-5">
                            {rides.filter(r => r.status === 'pending').slice(0, 3).map((r) => (
                                <div key={r.id} className="flex items-center gap-4">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(31,255,255,0.4)]" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-1">New: {r.passengerName}</p>
                                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">PENDING APPROVAL</p>
                                    </div>
                                </div>
                            ))}
                            {pendingApprovals > 0 && (
                                <div className="flex items-center gap-4">
                                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-1">{pendingApprovals} Pilots Waiting</p>
                                        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">VERIFICATION REQ</p>
                                    </div>
                                </div>
                            )}
                            {rides.length === 0 && pendingApprovals === 0 && (
                                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Buffer empty</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
