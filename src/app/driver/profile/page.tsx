"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store/useUserStore"
import { userService } from "@/lib/services/userService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, User, Camera, Phone, Hexagon, ShieldCheck, CheckCircle2, Star, Car } from "lucide-react"
import { motion } from "framer-motion"

export default function DriverProfile() {
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
                    <h1 className="text-3xl font-black italic tracking-tight text-primary">Partner <span className="text-white not-italic">Profile</span></h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Manage your professional identity</p>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="h-40 w-40 bg-surface rounded-[3rem] border-8 border-white/5 flex items-center justify-center text-primary shadow-glow overflow-hidden relative">
                            <User className="h-20 w-20 opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                            <div className="absolute bottom-4 flex items-center gap-1 bg-primary px-3 py-1 rounded-full text-[10px] font-black text-background italic">
                                <Star className="h-3 w-3 fill-background" /> 4.9
                            </div>
                        </div>
                        <button className="absolute -right-2 top-0 h-14 w-14 bg-charcoal border-4 border-background rounded-3xl flex items-center justify-center text-primary shadow-lg hover:scale-110 transition-transform">
                            <Camera className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <Card className="rounded-[3.5rem] bg-surface/40 border-white/5 p-8 space-y-8 shadow-premium">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Owner Name</p>
                            <input
                                type="text"
                                disabled={!isEditing}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-18 bg-charcoal border border-white/5 rounded-3xl px-8 text-2xl font-black italic uppercase tracking-tighter text-white focus:border-primary/50 outline-none disabled:opacity-50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Vehicle Number</p>
                                <div className="h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                    <span className="text-sm font-black text-white italic tracking-widest uppercase">{user?.vehicleNumber || "MH 12 XX 0000"}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Auto Model</p>
                                <div className="h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                    <span className="text-sm font-black text-white italic tracking-widest uppercase">BAJAJ RE</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-2">Mobile Verification</p>
                            <div className="flex items-center gap-4 h-18 bg-charcoal/50 border border-white/5 rounded-3xl px-8">
                                <Phone className="h-6 w-6 text-white/20" />
                                <span className="text-xl font-black tracking-[0.2em] text-white/40">{user?.phone}</span>
                                <CheckCircle2 className="ml-auto h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {isEditing ? (
                            <>
                                <Button className="flex-1 h-18 rounded-3xl bg-zinc-800 font-black uppercase tracking-widest" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button variant="premium" className="flex-1 h-18 rounded-3xl font-black uppercase tracking-widest shadow-glow" onClick={handleSave}>Save Hub Profile</Button>
                            </>
                        ) : (
                            <Button className="w-full h-18 rounded-3xl bg-white/5 border border-white/10 font-black uppercase tracking-widest hover:bg-white/10" onClick={() => setIsEditing(true)}>Edit Profile Info</Button>
                        )}
                    </div>
                </Card>

                <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 flex items-start gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Hexagon className="h-20 w-20 text-primary" />
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-glow shadow-primary/20">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-xs font-black text-white uppercase tracking-widest italic">Safety Badge Status</h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                            Successfully completed <span className="text-white">KYC Verification</span>. You are recognized as a <span className="text-primary italic">Samarth Premium Partner</span>.
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/5 mt-20 italic">Validated Partner Node • Smarth Network v1.0</p>
        </div>
    )
}
