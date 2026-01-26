"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store/useUserStore"
import { userService, SavedLocation } from "@/lib/services/userService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, Home, Briefcase, ShoppingBag, Landmark, Plus, Trash2, Search, Navigation } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function SavedLocations() {
    const router = useRouter()
    const { user, setUser } = useUserStore()
    const [isAdding, setIsAdding] = useState(false)
    const [newLabel, setNewLabel] = useState("")
    const [newAddress, setNewAddress] = useState("")

    const locations: SavedLocation[] = (user as any)?.savedLocations || []

    const handleAdd = async () => {
        if (!user?.id || !newLabel || !newAddress) return
        const loc: SavedLocation = {
            id: Math.random().toString(36).substr(2, 9),
            label: newLabel,
            address: newAddress,
            lat: 18.5204, // Default mock
            lng: 73.8567
        }
        await userService.addSavedLocation(user.id, loc)

        // Update local state
        const updatedUser = { ...user, savedLocations: [...locations, loc] } as any
        setUser(updatedUser)

        setIsAdding(false)
        setNewLabel("")
        setNewAddress("")
    }

    const handleRemove = async (loc: SavedLocation) => {
        if (!user?.id) return
        await userService.removeSavedLocation(user.id, loc)
        const updatedUser = { ...user, savedLocations: locations.filter(l => l.id !== loc.id) } as any
        setUser(updatedUser)
    }

    const getIcon = (label: string) => {
        const l = label.toLowerCase()
        if (l.includes('home')) return Home
        if (l.includes('work') || l.includes('office')) return Briefcase
        if (l.includes('market') || l.includes('shop')) return ShoppingBag
        return Landmark
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
                    <h1 className="text-3xl font-black italic tracking-tight">Saved <span className="text-primary not-italic">Places</span></h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Quick access to your regular spots</p>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {locations.map((loc, i) => {
                        const Icon = getIcon(loc.label)
                        return (
                            <motion.div
                                key={loc.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="rounded-[2.5rem] border-white/5 bg-surface/40 overflow-hidden group">
                                    <div className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
                                                <Icon className="h-7 w-7" />
                                            </div>
                                            <div className="max-w-[200px]">
                                                <h3 className="text-xl font-black italic uppercase tracking-tighter">{loc.label}</h3>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">{loc.address}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white/20 hover:text-alert hover:bg-alert/10 rounded-xl"
                                            onClick={() => handleRemove(loc)}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {isAdding ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="rounded-[3rem] border-primary/20 bg-surface/60 p-8 space-y-6 shadow-glow-sm">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest pl-2">Label (eg. Home, Work)</p>
                                    <input
                                        type="text"
                                        placeholder="WHERE IS THIS?"
                                        className="w-full h-16 bg-charcoal border border-white/5 rounded-2xl px-6 text-sm font-black uppercase tracking-widest focus:border-primary/50 outline-none"
                                        value={newLabel}
                                        onChange={(e) => setNewLabel(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest pl-2">Full Address</p>
                                    <input
                                        type="text"
                                        placeholder="ENTER STREET OR AREA"
                                        className="w-full h-16 bg-charcoal border border-white/5 rounded-2xl px-6 text-sm font-black uppercase tracking-widest focus:border-primary/50 outline-none"
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest bg-zinc-800"
                                    onClick={() => setIsAdding(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="premium"
                                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest"
                                    onClick={handleAdd}
                                >
                                    Save Place
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <Button
                        onClick={() => setIsAdding(true)}
                        className="w-full h-20 rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 font-black text-lg gap-3 uppercase tracking-widest italic"
                    >
                        <Plus className="h-6 w-6 text-primary" /> Add New Place
                    </Button>
                )}
            </div>

            {!isAdding && locations.length === 0 && (
                <div className="mt-20 text-center opacity-20">
                    <Navigation className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">No saved places yet</p>
                </div>
            )}
        </div>
    )
}
