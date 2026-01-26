"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Phone, MessageCircle, Mail, ShieldCheck, Info, MessageSquare, ExternalLink, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export default function SupportPage() {
    const router = useRouter()

    const contactMethods = [
        {
            name: "Call Support",
            desc: "Talk to our safety team",
            icon: Phone,
            action: () => window.location.href = "tel:+910000000000",
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            name: "WhatsApp Us",
            desc: "Chat for quick help",
            icon: MessageCircle,
            action: () => window.location.href = "https://wa.me/910000000000",
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            name: "Email Help",
            desc: "Detailed support requests",
            icon: Mail,
            action: () => window.location.href = "mailto:support@samarthride.com",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        }
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
                    <h1 className="text-3xl font-black italic tracking-tight">Help & <span className="text-primary not-italic">Support</span></h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">We are here for you 24/7</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    {contactMethods.map((method, i) => (
                        <motion.div
                            key={method.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card
                                onClick={method.action}
                                className="rounded-[2.5rem] border-white/5 bg-surface/40 overflow-hidden cursor-pointer group hover:bg-white/5 transition-all"
                            >
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className={`h-16 w-16 rounded-[1.5rem] ${method.bg} flex items-center justify-center ${method.color} shadow-lg shadow-black/20`}>
                                            <method.icon className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black italic uppercase tracking-tighter">{method.name}</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{method.desc}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-6 w-6 text-white/10 group-hover:text-primary transition-all group-hover:translate-x-1" />
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-4 pt-4">
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] pl-4">Quick Links</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: "How it works", icon: Info, path: "/how-to-use" },
                            { name: "Safety Tips", icon: ShieldCheck, path: "/safety" },
                            { name: "Privacy Policy", icon: MessageSquare, path: "/privacy" },
                            { name: "Terms of Use", icon: ExternalLink, path: "/terms" }
                        ].map((link) => (
                            <Button
                                key={link.name}
                                variant="ghost"
                                className="h-20 bg-white/5 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white/10"
                                onClick={() => router.push(link.path)}
                            >
                                <link.icon className="h-5 w-5 text-primary" />
                                <span className="text-[9px] font-black uppercase tracking-widest">{link.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>

                <Card className="rounded-[3rem] border-white/5 bg-primary/5 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldCheck className="h-20 w-20" />
                    </div>
                    <h3 className="text-lg font-black text-primary italic mb-2">Samarth Safety Shield</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Your safety is our #1 priority. For ongoing rides, use the Emergency button on the tracking screen for immediate SOS.</p>
                </Card>
            </div>

            <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/10 mt-20">Samarth Ride - Safe & Trusted Service</p>
        </div>
    )
}
