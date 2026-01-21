"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Info, ShieldCheck, Heart, MapPin, Mail, Phone, ExternalLink } from "lucide-react"

export default function AboutPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-background text-white p-6 md:p-12 font-sans overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />

            <div className="max-w-md mx-auto relative z-10 space-y-10">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/5"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-black italic tracking-tight">About <span className="text-primary not-italic">App</span></h1>
                </div>

                {/* Main Identity */}
                <div className="text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="h-24 w-24 bg-surface rounded-[2.5rem] p-0.5 border border-white/10 shadow-premium overflow-hidden">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black italic tracking-tighter">Samarth <span className="text-primary">Ride</span></h2>
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-primary italic">Vishwasacha Pravas</p>
                    </div>
                    <Card className="bg-white/5 border-white/5 p-6 rounded-[2.5rem] backdrop-blur-md">
                        <p className="text-sm font-medium leading-relaxed text-muted-foreground italic">
                            "Samarth Ride is built to empower local drivers and provide passengers with a safe, reliable, and affordable travel experience. We are bridge-building trust between drivers and villagers, ensuring every journey is a confident one."
                        </p>
                    </Card>
                </div>

                {/* App Specs */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface/50 border border-white/5 p-5 rounded-3xl text-center">
                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Version</p>
                            <p className="text-xl font-black text-white italic">v1.0.0</p>
                        </div>
                        <div className="bg-surface/50 border border-white/5 p-5 rounded-3xl text-center">
                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Origin</p>
                            <p className="text-xl font-black text-white italic">India 🇮🇳</p>
                        </div>
                    </div>

                    <div className="bg-primary/10 border border-primary/20 p-5 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="text-primary h-6 w-6" />
                            <span className="text-xs font-black uppercase tracking-widest text-primary italic">Verified Safety Core</span>
                        </div>
                        <Heart className="h-4 w-4 text-primary fill-primary/20" />
                    </div>
                </div>

                {/* Developer / Contact */}
                <Card className="bg-charcoal/40 border-white/5 p-8 rounded-[3rem] space-y-6">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Developed by</h3>
                        <p className="text-2xl font-black text-white italic tracking-tight">Rishabh Ajay Sonawane</p>
                        <p className="text-xs font-bold text-muted-foreground uppercase mt-1">Saffar Labs · Founder & Lead Engineer</p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                        <button onClick={() => window.location.href = 'mailto:saffarlabs@gmail.com'} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-primary/10 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-black uppercase tracking-wider">saffarlabs@gmail.com</span>
                            </div>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <button onClick={() => window.location.href = 'tel:8468943268'} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-primary/10 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-black uppercase tracking-wider">+91 84689 43268</span>
                            </div>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </Card>

                {/* Legal Links */}
                <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground pb-12">
                    <button onClick={() => router.push("/terms")} className="hover:text-primary transition-colors">Terms</button>
                    <button onClick={() => router.push("/privacy")} className="hover:text-primary transition-colors">Privacy</button>
                </div>
            </div>
        </div>
    )
}
