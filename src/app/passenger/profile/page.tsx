"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store/useUserStore"
import { userService } from "@/lib/services/userService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, User, Camera, Phone, Mail, MapPin, Edit3, ShieldCheck, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PassengerProfile() {
    const router = useRouter()
    const { user, setUser } = useUserStore()
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(user?.name || "")

    const handleSave = async () => {
        if (!user?.id) return
        await userService.updateProfile(user.id, { name })
        setUser({ ...user, name } as any)
        setIsEditing(false)
    }

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
                    <h1 className="text-3xl font-black italic tracking-tight">My <span className="text-primary not-italic">Profile</span></h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Manage your identity and trust</p>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex flex-col items-center">
                    <div className="relative group">
                        <div className="h-32 w-32 bg-surface rounded-[2.5rem] border-4 border-white/5 flex items-center justify-center text-primary shadow-glow overflow-hidden">
                            <User className="h-16 w-16 opacity-40" />
                        </div>
                        <button className="absolute -right-2 -bottom-2 h-12 w-12 bg-primary rounded-2xl border-4 border-background flex items-center justify-center text-background shadow-lg hover:scale-110 transition-transform">
                            <Camera className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <Card className="rounded-[2.5rem] bg-surface/40 border-white/5 p-8 space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Display Name</p>
                            <div className="relative">
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-16 bg-charcoal border border-white/5 rounded-2xl px-6 text-xl font-black italic uppercase tracking-tighter text-white focus:border-primary/50 outline-none disabled:opacity-50"
                                />
                                <Edit3 className={`absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary cursor-pointer hover:scale-110 transition-transform ${isEditing ? 'hidden' : ''}`} onClick={() => setIsEditing(true)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Mobile Number</p>
                            <div className="flex items-center gap-4 h-16 bg-charcoal/50 border border-white/5 rounded-2xl px-6">
                                <Phone className="h-5 w-5 text-white/20" />
                                <span className="text-lg font-black tracking-[0.2em] text-white/40">{user?.phone}</span>
                                <div className="ml-auto bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border border-green-500/20">Verified</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Account Type</p>
                            <div className="flex items-center gap-4 h-16 bg-charcoal/50 border border-white/5 rounded-2xl px-6">
                                <ShieldCheck className="h-5 w-5 text-white/20" />
                                <span className="text-lg font-black italic uppercase text-white/40">{user?.role}</span>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex gap-4"
                            >
                                <Button className="flex-1 h-16 rounded-2xl bg-zinc-800 font-black uppercase tracking-widest" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button variant="premium" className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest" onClick={handleSave}>Save Changes</Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 flex items-center gap-4">
                    <CheckCircle2 className="h-8 w-8 text-primary shrink-0" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                        Your account is currently <span className="text-white">Active</span>. Complete regular rides to maintain your <span className="text-primary italic">Trusted Partner</span> badge.
                    </p>
                </div>
            </div>

            <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/5 mt-20 italic">Smarth Ride - Vishwasacha Pravas v1.0</p>
        </div>
    )
}
