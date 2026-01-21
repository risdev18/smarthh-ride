"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, XCircle, CheckCircle, Eye, Loader2, Phone, User as UserIcon, RefreshCw } from "lucide-react"
import { adminService } from "@/lib/services/adminService"
import { UnifiedUser } from "@/lib/services/authService"
import { motion, AnimatePresence } from "framer-motion"

export default function DriverVerification() {
    const [drivers, setDrivers] = useState<UnifiedUser[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDriver, setSelectedDriver] = useState<UnifiedUser | null>(null)

    useEffect(() => {
        loadDrivers()
    }, [])

    const loadDrivers = async () => {
        setLoading(true)
        try {
            const data = await adminService.getAllDrivers()
            setDrivers(data)
        } catch (error) {
            console.error("Error loading drivers:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (driverId: string | undefined, status: 'approved' | 'rejected') => {
        if (!driverId) return
        try {
            await adminService.updateDriverStatus(driverId, status)
            loadDrivers() // Refresh list properly
            setSelectedDriver(null)
        } catch (error) {
            alert("Failed to update status")
        }
    }

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Fetching Real Partners...</p>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-surface/30 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                <div>
                    <h2 className="text-4xl font-black text-white italic tracking-tight">Partner <span className="text-primary not-italic">Verification</span></h2>
                    <div className="text-muted-foreground text-sm uppercase font-bold tracking-widest flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Live Firestore Sync Active
                    </div>
                </div>
                <Button
                    variant="premium"
                    className="rounded-2xl h-12 px-6 gap-2"
                    onClick={loadDrivers}
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Driver List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {drivers.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-20 border-2 border-dashed border-white/5 rounded-[3.5rem] text-center bg-white/1"
                            >
                                <p className="text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">No registration requests found</p>
                            </motion.div>
                        ) : (
                            drivers.map((d, idx) => (
                                <motion.div
                                    key={d.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card
                                        className={`cursor-pointer transition-all rounded-[2.5rem] border-white/5 overflow-hidden group ${selectedDriver?.id === d.id ? 'bg-primary/10 border-primary/30' : 'bg-surface/40 hover:bg-white/5'}`}
                                        onClick={() => setSelectedDriver(d)}
                                    >
                                        <CardContent className="p-6 flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="h-14 w-14 rounded-2xl bg-charcoal flex items-center justify-center shadow-inner group-hover:bg-primary/20 transition-colors">
                                                    <UserIcon className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-white text-xl tracking-tight leading-tight">{d.name}</h3>
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 italic">{d.phone}</p>
                                                </div>
                                            </div>
                                            <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border-2 transition-all ${d.verificationStatus === 'pending' || !d.verificationStatus ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]' :
                                                d.verificationStatus === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' :
                                                    'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                                }`}>
                                                {d.verificationStatus || 'pending'}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {/* Verification Detail View */}
                <div>
                    <AnimatePresence mode="wait">
                        {selectedDriver ? (
                            <motion.div
                                key={selectedDriver.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <Card className="sticky top-6 rounded-[3.5rem] border-white/10 bg-surface/60 backdrop-blur-3xl overflow-hidden shadow-2xl relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                                    <CardHeader className="bg-charcoal/30 p-10">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <CardTitle className="text-4xl font-black text-white italic tracking-tighter">{selectedDriver.name}</CardTitle>
                                                <CardDescription className="flex items-center gap-3">
                                                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{selectedDriver.vehicleType || 'Auto Rickshaw'}</span>
                                                    <span className="text-white/40 font-black">•</span>
                                                    <span className="text-white/80 font-bold tracking-widest">{selectedDriver.phone}</span>
                                                </CardDescription>
                                            </div>
                                            <div className="h-16 w-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10">
                                                <ShieldCheck className="h-8 w-8 text-primary opacity-50" />
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-10 space-y-10">
                                        <div className="space-y-5">
                                            <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary" /> Verified KYC Documents
                                            </h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                {Object.entries(selectedDriver.documents || {}).map(([key, doc]) => (
                                                    <motion.div
                                                        key={key}
                                                        whileHover={{ x: 5 }}
                                                        className="flex items-center justify-between p-5 bg-charcoal/40 rounded-[2rem] border border-white/5 group transition-all hover:border-white/20"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                                <Eye className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                                                            </div>
                                                            <span className="text-sm font-black text-white italic uppercase tracking-tighter">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        </div>
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="h-10 px-6 rounded-xl border-white/10 font-black text-[10px] uppercase tracking-widest"
                                                            onClick={() => window.open(doc.url, '_blank')}
                                                        >
                                                            Open File
                                                        </Button>
                                                    </motion.div>
                                                ))}
                                                {(!selectedDriver.documents || Object.keys(selectedDriver.documents).length === 0) && (
                                                    <div className="p-16 border-2 border-dashed border-white/5 rounded-[2.5rem] text-center bg-white/1">
                                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Partner has not uploaded KYC files</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <Button
                                                className="flex-1 h-20 bg-success hover:bg-success/90 rounded-[2rem] font-black text-xl shadow-glow active:scale-95 transition-all"
                                                onClick={() => handleStatusChange(selectedDriver.id, 'approved')}
                                            >
                                                <CheckCircle className="mr-3 h-6 w-6" /> APPROVE
                                            </Button>
                                            <Button
                                                className="flex-1 h-20 bg-alert hover:bg-alert/90 rounded-[2rem] font-black text-xl active:scale-95 transition-all"
                                                variant="destructive"
                                                onClick={() => handleStatusChange(selectedDriver.id, 'rejected')}
                                            >
                                                <XCircle className="mr-3 h-6 w-6" /> REJECT
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem] text-muted-foreground gap-6 bg-surface/20 relative group">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: [0.1, 0.2, 0.1]
                                    }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="absolute inset-0 bg-primary/5 rounded-[4rem]"
                                />
                                <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                    <UserIcon className="h-10 w-10 opacity-20" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/50">Verification Queue</p>
                                    <p className="text-xs font-bold text-muted-foreground">Select a partner profile to begin KYC review</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
