"use client"

import { useState, useEffect } from "react"
import { driverService, DriverData } from "@/lib/services/driverService"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    FileText,
    User,
    Phone,
    Car,
    ShieldCheck,
    Search,
    Filter,
    ChevronRight,
    ArrowUpRight,
    MapPin,
    Users,
    ChevronLeft,
    Terminal
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminDriversPage() {
    const [drivers, setDrivers] = useState<DriverData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isMobileView, setIsMobileView] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobileView(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        const unsubscribe = driverService.listenToDrivers((updatedDrivers) => {
            setDrivers(updatedDrivers)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const handleStatusChange = async (driverId: string, status: 'approved' | 'rejected') => {
        if (!confirm(`Are you sure you want to ${status} this driver?`)) return
        try {
            await driverService.verifyDriver(driverId, status)
            if (isMobileView) setSelectedDriver(null)
        } catch (e: any) {
            alert("Error updating status: " + e.message)
        }
    }

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm) ||
        (d.vehicleNumber && d.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // Modal to show Base64 image
    const PreviewModal = () => {
        if (!previewUrl) return null;
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/95 backdrop-blur-2xl"
                onClick={() => setPreviewUrl(null)}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative max-w-5xl max-h-[90vh] w-full bg-slate-900 rounded-[2rem] sm:rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-4 sm:p-6 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <FileText className="text-primary h-5 w-5" />
                            </div>
                            <h3 className="font-black uppercase tracking-tight text-sm sm:text-base">SECURE DATA VIEW</h3>
                        </div>
                        <button onClick={() => setPreviewUrl(null)} className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-black/50">
                        <img src={previewUrl} alt="Document" className="max-w-full h-auto rounded-xl shadow-2xl ring-1 ring-white/10" />
                    </div>
                </motion.div>
            </motion.div>
        )
    }

    return (
        <div className="space-y-6 sm:space-y-8 pb-20 max-w-[1600px] mx-auto">
            <AnimatePresence>
                <PreviewModal />
            </AnimatePresence>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {[
                    { label: 'Total Fleet', value: drivers.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Pending', value: drivers.filter(d => d.status === 'pending').length, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                    { label: 'Verified', value: drivers.filter(d => d.status === 'approved').length, icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Active Hub', value: drivers.filter(d => d.status === 'online').length, icon: Terminal, color: 'text-primary', bg: 'bg-primary/10' }
                ].map((stat, i) => (
                    <Card key={i} className="bg-slate-900/40 border-white/5 rounded-2xl sm:rounded-[2.5rem] overflow-hidden group shadow-2xl">
                        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                            <div className={`h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <stat.icon className="h-5 w-5 sm:h-7 sm:w-7" />
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                                <p className="text-xl sm:text-3xl font-black tracking-tighter text-white">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
                {/* List Panel */}
                <div className={`flex-1 w-full space-y-4 ${selectedDriver && isMobileView ? 'hidden' : 'block'}`}>
                    <div className="flex items-center gap-3 bg-slate-900/60 border border-white/5 p-2 pl-4 rounded-2xl sm:rounded-[2rem] shadow-2xl">
                        <Search className="h-5 w-5 text-slate-600" />
                        <input
                            placeholder="Find pilots or vehicles..."
                            className="bg-transparent flex-1 outline-none font-bold text-xs sm:text-sm h-10 sm:h-12 text-white placeholder:text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
                        {filteredDrivers.map(d => (
                            <motion.div
                                layoutId={d.id}
                                key={d.id}
                                onClick={() => setSelectedDriver(d)}
                                className={`flex items-center gap-4 p-4 sm:p-5 bg-slate-900/40 border transition-all cursor-pointer group rounded-[1.5rem] sm:rounded-[2rem] ${selectedDriver?.id === d.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-white/5 hover:border-white/10'}`}
                            >
                                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 relative">
                                    <User className="h-6 w-6 sm:h-8 sm:w-8 text-slate-700" />
                                    {d.status === 'online' && <div className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary ring-2 ring-slate-950"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-black text-sm sm:text-lg text-white truncate uppercase tracking-tight">{d.name}</h3>
                                        <div className={`h-1.5 w-1.5 rounded-full ${d.status === 'approved' ? 'bg-green-500' : d.status === 'pending' ? 'bg-yellow-500' : 'bg-slate-700'}`} />
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-slate-500 font-bold tracking-widest uppercase">{d.phone} • {d.vehicleNumber || 'NO ASSET'}</p>
                                </div>
                                <ArrowUpRight className={`h-4 w-4 sm:h-5 sm:w-5 transition-all ${selectedDriver?.id === d.id ? 'text-primary rotate-45 scale-125' : 'text-slate-800'}`} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className={`w-full lg:w-[460px] lg:sticky lg:top-8 ${selectedDriver ? 'block' : 'hidden lg:block'}`}>
                    {selectedDriver ? (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <Card className="bg-slate-900 border border-white/5 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden ring-1 ring-white/5">
                                <div className="h-24 sm:h-32 bg-slate-950 relative p-4 sm:p-6">
                                    <div className="flex justify-between items-start">
                                        <button
                                            onClick={() => setSelectedDriver(null)}
                                            className="h-10 w-10 sm:h-12 sm:w-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${selectedDriver.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                            {selectedDriver.status}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-10 left-8 sm:left-10 h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-slate-900 border-4 border-slate-900 shadow-2xl flex items-center justify-center">
                                        <User className="h-10 w-10 sm:h-12 sm:w-12 text-slate-700" />
                                    </div>
                                </div>

                                <CardContent className="pt-14 sm:pt-16 pb-8 px-6 sm:px-10 space-y-8 sm:space-y-10">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">PIOT IDENTIFICATION</p>
                                        <h2 className="text-2xl sm:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">{selectedDriver.name}</h2>
                                        <div className="flex flex-wrap items-center gap-4 mt-4">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                                <Phone className="h-3 w-3 text-primary" /> {selectedDriver.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                                <Car className="h-3 w-3 text-primary" /> {selectedDriver.vehicleNumber || 'UNLINKED'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase text-slate-600 flex items-center gap-2 tracking-[0.3em]">
                                            <div className="h-1 w-4 bg-primary rounded-full" /> CREDENTIAL GRID
                                        </h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {[
                                                { label: 'Driving License', key: 'licenseUrl' },
                                                { label: 'RC Front', key: 'rcBookUrl' },
                                                { label: 'Insurance Copy', key: 'insuranceUrl' }
                                            ].map((docType) => {
                                                const url = selectedDriver.documents?.[docType.key as keyof typeof selectedDriver.documents];
                                                const isUploaded = !!url;
                                                return (
                                                    <div key={docType.key} className="flex items-center justify-between p-4 bg-slate-950 border border-white/5 rounded-2xl">
                                                        <div>
                                                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-tight">{docType.label}</span>
                                                            <p className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${isUploaded ? 'text-primary' : 'text-slate-700'}`}>
                                                                {isUploaded ? 'AUTHORIZED' : 'MISSING'}
                                                            </p>
                                                        </div>
                                                        {isUploaded && (
                                                            <button
                                                                onClick={() => setPreviewUrl(url as string)}
                                                                className="h-10 px-5 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 hover:bg-primary/10 transition-colors"
                                                            >
                                                                SCAN
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5 flex flex-col gap-3">
                                        <button
                                            onClick={() => handleStatusChange(selectedDriver.id!, 'approved')}
                                            disabled={selectedDriver.status === 'approved'}
                                            className="w-full bg-primary text-black font-black h-16 sm:h-20 rounded-2xl sm:rounded-3xl shadow-xl shadow-primary/10 active:scale-95 transition-all text-xl tracking-tighter uppercase italic disabled:opacity-30 disabled:grayscale"
                                        >
                                            AUTHORIZE PILOT
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(selectedDriver.id!, 'rejected')}
                                            disabled={selectedDriver.status === 'rejected'}
                                            className="w-full bg-white/5 text-red-500 font-black h-12 rounded-2xl active:scale-95 transition-all text-[10px] tracking-widest uppercase disabled:opacity-30"
                                        >
                                            TERMINATE APPLICATION
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <div className="hidden lg:flex h-[600px] flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3.5rem] text-slate-700 space-y-6 bg-slate-900/20">
                            <div className="h-20 w-20 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-center animate-pulse">
                                <Terminal className="h-10 w-10 text-slate-800" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="font-black uppercase tracking-[0.4em] text-xs">Awaiting Command</p>
                                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Select target pilot to initialize protocol</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
