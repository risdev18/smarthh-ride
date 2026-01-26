"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ShieldAlert, Phone, Share2, AlertTriangle, Users, MapPin, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function EmergencyPage() {
    const router = useRouter()
    const [isSharing, setIsSharing] = useState(false)
    const [sosActive, setSosActive] = useState(false)

    const handleSos = () => {
        setSosActive(true)
        // Mock SOS trigger
        console.log("SOS TRIGGERED: Emergency services notified.")
        window.location.href = "tel:112" // Universal emergency number in India
    }

    const handleShareLocation = () => {
        setIsSharing(true)
        setTimeout(() => {
            setIsSharing(false)
            alert("Live location shared with your emergency contacts!")
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-background text-white p-6 pb-20 font-sans overflow-hidden">
            {/* Pulsing Background Logic */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <AnimatePresence>
                    {sosActive && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-alert animate-pulse"
                        />
                    )}
                </AnimatePresence>
            </div>

            <div className="relative z-10 flex items-center gap-6 mb-10 bg-alert/10 p-6 rounded-[2.5rem] border border-alert/20 backdrop-blur-xl">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight text-white">Emergency <span className="text-alert not-italic">Center</span></h1>
                    <p className="text-alert/60 font-black uppercase tracking-widest text-[9px] mt-1">Immediate Safety Actions</p>
                </div>
            </div>

            <div className="relative z-10 space-y-12">
                <div className="flex flex-col items-center justify-center py-10">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSos}
                        className={`h-64 w-64 rounded-full border-[10px] flex flex-col items-center justify-center gap-4 transition-all shadow-[0_0_50px_rgba(239,68,68,0.3)] ${sosActive ? 'bg-alert border-white/50 animate-pulse' : 'bg-alert/20 border-alert shadow-glow shadow-alert/40'}`}
                    >
                        <ShieldAlert className="h-24 w-24 text-white" />
                        <span className="text-4xl font-black italic tracking-tighter text-white">S.O.S</span>
                        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Press for Help</p>
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Button
                        onClick={handleShareLocation}
                        disabled={isSharing}
                        className="h-24 rounded-[3rem] bg-surface border border-white/5 flex items-center justify-between px-10 hover:bg-white/5"
                    >
                        <div className="flex items-center gap-6">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                {isSharing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Share2 className="h-6 w-6" />}
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-black italic leading-none mb-1">Share Location</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">To Emergency Contacts</p>
                            </div>
                        </div>
                        <ChevronRight className="h-6 w-6 opacity-20" />
                    </Button>

                    <Button
                        onClick={() => window.location.href = "tel:+918888888888"}
                        className="h-24 rounded-[3rem] bg-surface border border-white/5 flex items-center justify-between px-10 hover:bg-white/5"
                    >
                        <div className="flex items-center gap-6">
                            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Users className="h-6 w-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-black italic leading-none mb-1">Police / PCR</h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Call Local Station</p>
                            </div>
                        </div>
                        <ChevronRight className="h-6 w-6 opacity-20" />
                    </Button>
                </div>

                <Card className="rounded-[3rem] border-white/5 bg-surface/40 p-10 flex items-start gap-6">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Accurate Location</p>
                        <h4 className="text-sm font-black text-white italic leading-relaxed uppercase">Shivaji Nagar, Pune, Maharashtra 411005</h4>
                    </div>
                </Card>
            </div>

            <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/5 mt-20 italic">Smarth Ride Safe Protocol Activated</p>
        </div>
    )
}

function ChevronRight(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
    )
}
