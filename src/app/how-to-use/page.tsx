"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, BookOpen, Smartphone, Search, Navigation, UserCheck, ShieldCheck, HelpCircle, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function HowToUse() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'passenger' | 'driver'>('passenger')

    const passengerSteps = [
        { title: "Set Destination", desc: "Type your drop-off point in the search bar on the home screen.", icon: Search },
        { title: "Review Fare", desc: "See the estimated fare and booking distance clearly before you confirm.", icon: Navigation },
        { title: "Wait for Match", desc: "We scan local Samarth partners. Once matched, you'll see driver info.", icon: UserCheck },
        { title: "Secure OTP", desc: "Share the 4-digit code with your partner only after they arrive at your spot.", icon: ShieldCheck }
    ]

    const driverSteps = [
        { title: "Go Online", desc: "Toggle the power button to start receiving ride requests in your area.", icon: Smartphone },
        { title: "Accept Request", desc: "Tap the big accept button when a ride pops up on your radar.", icon: Navigation },
        { title: "Verify OTP", desc: "Ask for the passenger's 4-digit code and enter it to begin the trip.", icon: ShieldCheck },
        { title: "Collect Payment", desc: "Complete the ride and collect the cash amount shown on your screen.", icon: HelpCircle }
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
                    <h1 className="text-3xl font-black italic tracking-tight text-white">App <span className="text-primary not-italic">Guide</span></h1>
                    <p className="text-white/40 font-black uppercase tracking-widest text-[9px] mt-1 italic">Master the Samarth Experience</p>
                </div>
            </div>

            <div className="flex gap-4 mb-10 bg-surface/50 p-2 rounded-[2rem] border border-white/5">
                <button
                    onClick={() => setActiveTab('passenger')}
                    className={`flex-1 h-14 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'passenger' ? 'bg-primary text-background italic shadow-glow shadow-primary/30' : 'text-white/40 hover:text-white'}`}
                >
                    Passenger
                </button>
                <button
                    onClick={() => setActiveTab('driver')}
                    className={`flex-1 h-14 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all ${activeTab === 'driver' ? 'bg-primary text-background italic shadow-glow shadow-primary/30' : 'text-white/40 hover:text-white'}`}
                >
                    Partner
                </button>
            </div>

            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {(activeTab === 'passenger' ? passengerSteps : driverSteps).map((step, i) => (
                            <div key={step.title} className="flex gap-6 items-start">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-16 w-16 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-primary shadow-premium">
                                        <step.icon className="h-7 w-7" />
                                    </div>
                                    {i < 3 && <div className="w-0.5 h-12 bg-white/5" />}
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-lg font-black italic uppercase tracking-tighter text-white mb-1">
                                        Step {i + 1}: {step.title}
                                    </h3>
                                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            <Card className="mt-16 rounded-[3rem] border-white/5 bg-primary/5 p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <BookOpen className="h-20 w-20" />
                </div>
                <h3 className="text-lg font-black text-primary italic mb-2">Need more help?</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed mb-6">Explore our YouTube tutorials for a live walkthrough of the registration and booking process.</p>
                <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-widest">Watch Tutorials</Button>
            </Card>

            <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/5 mt-20 italic">Smarth Education Portal v1.0</p>
        </div>
    )
}
