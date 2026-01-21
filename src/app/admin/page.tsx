"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAdminStore } from "@/lib/store/useAdminStore"
import { adminService } from "@/lib/services/adminService"
import { Users, ShieldCheck, FileText, Map as MapIcon, Loader2, TrendingUp, AlertCircle, BarChart } from "lucide-react"
import { motion } from "framer-motion"

export default function AdminDashboard() {
    const { documentTypes } = useAdminStore()
    const [stats, setStats] = useState({
        totalDrivers: 0,
        activeDrivers: 0,
        approvedDrivers: 0,
        pendingApprovals: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getStats()
                setStats(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
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
            title: "Service Regions",
            value: 5,
            description: "Active operational zones",
            icon: MapIcon,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        }
    ]

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tight">System <span className="text-primary not-italic">Overview</span></h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Real-time performance metrics from Smarth Network</p>
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

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="rounded-[3rem] border-white/5 bg-surface/20 p-8">
                    <h3 className="text-xl font-black text-white italic mb-4 flex items-center gap-3">
                        <ShieldCheck className="text-primary" /> Compliance Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/70">Required Doc Types</span>
                            <span className="font-black text-primary">{documentTypes.length}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/70">Approved Partners</span>
                            <span className="font-black text-green-500">{stats.approvedDrivers}</span>
                        </div>
                    </div>
                </Card>

                <Card className="rounded-[3rem] border-white/5 bg-surface/20 p-8 flex flex-col justify-center items-center text-center space-y-4 border-dashed border-2">
                    <BarChart className="h-12 w-12 text-white/10" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Detailed Analytics</p>
                    <p className="text-xs font-bold text-white/40">Growth charts and revenue insights coming soon to your premium console.</p>
                </Card>
            </div>
        </div>
    )
}
