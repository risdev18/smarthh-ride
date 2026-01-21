"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Mail, Clock, MessageSquare, ChevronRight, ArrowLeft, ShieldCheck, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SupportPage() {
    const router = useRouter()
    const [isFlipped, setIsFlipped] = useState(false)
    const [issueType, setIssueType] = useState("")

    const supportInfo = {
        phone: "8468943268",
        email: "saffarlabs@gmail.com",
        timing: "8 AM – 8 PM"
    }

    return (
        <div className="min-h-screen bg-background text-white p-6 md:p-12 font-sans">
            <div className="max-w-md mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/5 hover:bg-white/10"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-black italic tracking-tight">Support <span className="text-primary not-italic">Hub</span></h1>
                </div>

                {/* Flip Card Section */}
                <div className="relative h-[250px] w-full perspective-1000">
                    <motion.div
                        className="relative w-full h-full transition-all duration-700 preserve-3d cursor-pointer"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        {/* Front Side: Support Status */}
                        <div className="absolute inset-0 backface-hidden">
                            <Card className="h-full w-full bg-gradient-to-br from-primary/20 to-charcoal border-primary/30 rounded-[2.5rem] flex flex-col items-center justify-center p-8 border-2 shadow-glow">
                                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
                                    <HelpCircle className="h-8 w-8 text-background font-bold" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-widest text-white">How can we help?</h2>
                                <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-tighter transition-all group-hover:text-primary">Tap to view contact details</p>
                            </Card>
                        </div>

                        {/* Back Side: Contact Info */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180">
                            <Card className="h-full w-full bg-surface border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center space-y-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Call Us</p>
                                        <p className="text-lg font-black text-white">{supportInfo.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Email Support</p>
                                        <p className="text-sm font-black text-white truncate">{supportInfo.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Service Hours</p>
                                        <p className="text-sm font-black text-white">{supportInfo.timing}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>

                {/* Raise an Issue Form */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Raise an Issue</h3>
                    <div className="bg-surface/50 border border-white/5 rounded-[2rem] p-6 space-y-6 backdrop-blur-3xl">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em] ml-1">Issue Category</label>
                            <select
                                className="w-full h-14 bg-background/50 border-2 border-white/5 rounded-2xl px-5 font-bold text-white outline-none focus:border-primary/40 transition-all appearance-none italic"
                                value={issueType}
                                onChange={(e) => setIssueType(e.target.value)}
                            >
                                <option value="" disabled>Select problem type</option>
                                <option value="ride">Ride problem</option>
                                <option value="behavior">Driver behavior</option>
                                <option value="app">App not working</option>
                                <option value="payment">Payment issue</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em] ml-1">Description</label>
                            <textarea
                                placeholder="Explain your issue briefly..."
                                className="w-full h-32 bg-background/50 border-2 border-white/5 rounded-2xl p-5 font-bold text-white outline-none focus:border-primary/40 transition-all resize-none text-sm"
                            />
                        </div>

                        <Button
                            className="w-full h-16 rounded-2xl text-lg font-black italic shadow-glow bg-primary text-background hover:scale-[1.02] transition-all"
                            onClick={() => alert("Issue reported successfully to Samarth Safety Team.")}
                        >
                            SUBMIT TICKET
                        </Button>
                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="text-center py-4 opacity-50">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]">Samarth Ride Safety Protocols v1.0</p>
                </div>
            </div>

            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    )
}
