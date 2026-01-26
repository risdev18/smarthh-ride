"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAdminStore } from "@/lib/store/useAdminStore"
import { adminService } from "@/lib/services/adminService"
import { Users, ShieldCheck, FileText, Map as MapIcon, Loader2, TrendingUp, AlertCircle, BarChart, Navigation, Clock, User, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
    const router = useRouter()
    const { documentTypes } = useAdminStore()
    const [stats, setStats] = useState({
        totalDrivers: 0,
        activeDrivers: 0,
        approvedDrivers: 0,
        pendingApprovals: 0
    })
    const [liveRides, setLiveRides] = useState<any[]>([])
    const [onlineDrivers, setOnlineDrivers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, ridesData, driversData] = await Promise.all([
                    adminService.getStats(),
                    adminService.getAllRides(5), // Latest 5 rides for dashboard
                    adminService.getActiveDrivers()
                ])
                setStats(statsData)
                setLiveRides(ridesData)
                setOnlineDrivers(driversData)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Loading Live Insights...</p>
        </div>
    )

    const cards = [
        {
            title: "Live Partners",
            value: stats.activeDrivers,
            description: "Approved & Currently Online",
            icon: TrendingUp,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Pending Reviews",
            value: stats.pendingApprovals,
            description: "Awaiting KYC Approval",
            icon: AlertCircle,
            color: "text-alert",
            bg: "bg-alert/10",
            alert: stats.pendingApprovals > 0
        },
        {
            title: "Total Fleet",
            value: stats.totalDrivers,
            description: "Registered Partner Profiles",
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            title: "Active Rides",
            value: liveRides.filter(r => r.status !== 'completed' && r.status !== 'cancelled').length,
            description: "In-progress system trips",
            icon: Navigation,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        }
    ]

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tight">System <span className="text-primary not-italic">Overview</span></h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Real-time performance metrics from Smarth Network</p>
                </div>
                <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live Monitoring Active</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="rounded-[2.5rem] border-white/5 bg-surface/40 backdrop-blur-3xl overflow-hidden group hover:border-primary/20 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{card.title}</CardTitle>
                                <div className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                                    <card.icon className="h-5 w-5" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white italic">{card.value}</span>
                                    {card.alert && (
                                        <div className="h-2 w-2 rounded-full bg-alert animate-ping" />
                                    )}
                                </div>
                                <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tighter">{card.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-7">
                {/* Recent Rides Table */}
                <Card className="lg:col-span-4 rounded-[3rem] border-white/5 bg-surface/20 p-8 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-white italic flex items-center gap-3">
                            <Navigation className="text-primary" /> Recent Trips
                        </h3>
                        <button
                            onClick={() => router.push('/admin/rides')}
                            className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                        >
                            View All <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {liveRides.length > 0 ? liveRides.map((ride, i) => (
                            <div key={ride.id} className="bg-white/5 rounded-3xl p-5 flex items-center justify-between group hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${ride.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                        ride.status === 'cancelled' ? 'bg-alert/10 text-alert' : 'bg-primary/10 text-primary'
                                        }`}>
                                        <Navigation className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white tracking-tight">{ride.passengerName || "Passenger"}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{ride.pickup} → {ride.drop}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white italic">₹{ride.fare}</p>
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${ride.status === 'completed' ? 'text-green-500' :
                                        ride.status === 'cancelled' ? 'text-alert' : 'text-primary'
                                        }`}>{ride.status}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="h-40 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-[2rem]">
                                <Clock className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No rides found</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Online Drivers List */}
                <Card className="lg:col-span-3 rounded-[3rem] border-white/5 bg-surface/20 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-white italic flex items-center gap-3">
                            <Users className="text-green-500" /> Online Partners
                        </h3>
                        <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
                            Live
                        </div>
                    </div>

                    <div className="space-y-4">
                        {onlineDrivers.length > 0 ? onlineDrivers.map((driver, i) => (
                            <div key={driver.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-green-500/20 transition-all">
                                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black text-white truncate">{driver.name}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{driver.vehicleNumber || "Partner"}</p>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            </div>
                        )) : (
                            <div className="h-40 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-[2rem]">
                                <Users className="h-8 w-8 mb-2 opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-center">No partners <br /> online currently</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
