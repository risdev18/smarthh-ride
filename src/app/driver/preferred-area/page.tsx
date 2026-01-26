"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store/useUserStore"
import { userService } from "@/lib/services/userService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, Search, Navigation, CheckCircle2, Star, Target, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PreferredArea() {
    const router = useRouter()
    const { user, setUser } = useUserStore()

    const areas = ["Kothrud", "Shivajinagar", "Pune Station", "Swargate", "Hadapsar", "Viman Nagar", "Hinjewadi", "Baner", "Katraj", "Pimpri"]
    const [selected, setSelected] = useState<string[]>((user as any)?.preferredAreas || [])

    const toggleArea = async (area: string) => {
        let newSelected = [...selected]
        if (newSelected.includes(area)) {
            newSelected = newSelected.filter(a => a !== area)
        } else {
            if (newSelected.length >= 2) {
                newSelected = [newSelected[1], area] // keep last 2
            } else {
                newSelected.push(area)
            }
        }
        setSelected(newSelected)

        if (user?.id) {
            await userService.updatePreferredAreas(user.id, newSelected)
            const updatedUser = { ...user, preferredAreas: newSelected } as any
            setUser(updatedUser)
        }
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
                    <h1 className="text-3xl font-black italic tracking-tight">Preferred <span className="text-primary not-italic">Areas</span></h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Get priority for rides in these zones</p>
                </div>
            </div>

            <div className="space-y-8">
                <Card className="rounded-[2.5rem] bg-surface/40 border-white/5 p-8 relative overflow-hidden">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Info className="h-5 w-5" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                            Select up to <span className="text-white">2 areas</span> where you want to work today. We will prioritize sending you ride requests from these regions.
                        </p>
                    </div>

                    <div className="bg-charcoal/50 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Selected Zones</span>
                        </div>
                        <div className="flex gap-2">
                            {selected.length === 0 && <span className="text-[10px] font-black text-muted-foreground uppercase">None</span>}
                            {selected.map(s => (
                                <span key={s} className="px-3 py-1 bg-primary rounded-lg text-[10px] font-black text-background italic uppercase">{s}</span>
                            ))}
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    {areas.map((area, i) => {
                        const isSelected = selected.includes(area)
                        return (
                            <motion.button
                                key={area}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => toggleArea(area)}
                                className={`h-24 rounded-[1.5rem] border transition-all flex flex-col items-center justify-center gap-2 ${isSelected
                                        ? 'bg-primary border-primary shadow-glow shadow-primary/30'
                                        : 'bg-surface border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-background/20' : 'bg-white/5'}`}>
                                    {isSelected ? <CheckCircle2 className="h-4 w-4 text-white" /> : <MapPin className="h-4 w-4 text-white/30" />}
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${isSelected ? 'text-background italic' : 'text-white/40'}`}>
                                    {area}
                                </span>
                            </motion.button>
                        )
                    })}
                </div>
            </div>

            <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/10 mt-20 italic">Smarth Dispatch Optimization v1.0</p>
        </div>
    )
}
