"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { IndianRupee, Star, ThumbsUp, CheckCircle, ArrowRight, User, Heart, MessageSquare, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Suspense } from "react"

function PaymentFeedbackContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [rating, setRating] = useState(0)
    const [paid, setPaid] = useState(false)
    const [hoverRating, setHoverRating] = useState(0)

    const fare = searchParams.get('fare') || "145"
    const driverName = searchParams.get('driver') || "Raju"

    if (paid) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="h-32 w-32 bg-primary rounded-[2.5rem] flex items-center justify-center mb-8 shadow-glow"
                >
                    <CheckCircle className="h-16 w-16 text-background stroke-[3px]" />
                </motion.div>

                <h1 className="text-4xl font-black italic text-white mb-2">Trip Summary Sent!</h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-12">Thank you for being a part of Samarth Ride</p>

                <Button
                    className="w-full max-w-sm h-20 rounded-3xl text-xl font-black italic shadow-glow bg-white text-background hover:bg-zinc-200"
                    onClick={() => router.push('/passenger')}
                >
                    BACK TO HOME
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-white p-6 font-sans flex flex-col justify-end pb-12">
            <div className="space-y-8 max-md mx-auto w-full">
                {/* Fare Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center space-y-2 mb-10"
                >
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Final Mission Fare</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-7xl font-black italic tracking-tighter">₹{fare}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Cash collection verified</span>
                    </div>
                </motion.div>

                {/* Main Card */}
                <Card className="rounded-[4rem] bg-surface/40 border-white/5 backdrop-blur-3xl p-10 space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Heart className="h-32 w-32" />
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-glow shadow-primary/10">
                                <User className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic">Rate your <span className="text-primary italic">Partner</span></h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Help {driverName} grow their trust profile</p>
                            </div>
                        </div>

                        {/* Rating Component */}
                        <div className="flex justify-between items-center py-4 px-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="relative group outline-none"
                                >
                                    <motion.div
                                        animate={{
                                            scale: (hoverRating >= star || rating >= star) ? 1.2 : 1,
                                            rotate: (hoverRating >= star || rating >= star) ? [0, -10, 10, 0] : 0
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Star
                                            className={`h-10 w-10 transition-colors ${(hoverRating >= star || rating >= star)
                                                ? 'fill-primary text-primary drop-shadow-[0_0_8px_rgba(245,200,66,0.3)]'
                                                : 'text-white/10'
                                                }`}
                                        />
                                    </motion.div>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Quick compliment</p>
                            <div className="grid grid-cols-2 gap-3">
                                {['Safe Driver', 'Clean Auto', 'Polite Hub', 'Ontime'].map(tag => (
                                    <button
                                        key={tag}
                                        className="h-12 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all hover:border-white/10"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button
                        disabled={rating === 0}
                        className="w-full h-20 text-2xl font-black rounded-3xl shadow-glow group disabled:opacity-30 transition-all font-sans"
                        variant="premium"
                        onClick={() => setPaid(true)}
                    >
                        <div className="flex items-center justify-center gap-3">
                            <span>SUBMIT & FEEDBACK</span>
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Button>
                </Card>
            </div>

            <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/5 mt-12 italic">Samarth Ride - Vishwasacha Pravas v1.0</p>
        </div>
    )
}

export default function PaymentFeedback() {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-background flex flex-col items-center justify-center p-8 text-center"><Loader2 className="h-12 w-12 text-primary animate-spin" /></div>}>
            <PaymentFeedbackContent />
        </Suspense>
    )
}
