"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store/useUserStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Phone, Globe, Bell, LogOut, ArrowLeft, Camera, Shield, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export default function SettingsPage() {
    const router = useRouter()
    const { user, logout } = useUserStore()
    const [language, setLanguage] = useState("Marathi")
    const [notifications, setNotifications] = useState(true)

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    return (
        <div className="min-h-screen bg-background text-white p-6 md:p-12 font-sans">
            <div className="max-w-md mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white/5"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-3xl font-black italic tracking-tight">Settings</h1>
                    </div>
                </div>

                {/* Profile Section */}
                <section className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Your Profile</h3>
                    <Card className="bg-surface/50 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-3xl overflow-hidden relative">
                        <div className="flex flex-col items-center gap-6 py-4">
                            <div className="relative">
                                <div className="h-24 w-24 bg-primary rounded-[2rem] flex items-center justify-center shadow-glow overflow-hidden">
                                    {user?.name ? (
                                        <span className="text-4xl font-black text-background italic">{user.name[0]}</span>
                                    ) : (
                                        <User className="h-10 w-10 text-background" />
                                    )}
                                </div>
                                <button className="absolute -right-2 -bottom-2 h-10 w-10 bg-charcoal border-4 border-background rounded-full flex items-center justify-center text-primary shadow-lg hover:scale-110 transition-transform">
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="w-full space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase ml-1">Full Name</p>
                                    <Input defaultValue={user?.name} className="h-14 rounded-2xl bg-black/20 border-white/5 font-bold italic" readOnly />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase ml-1">Phone Number</p>
                                    <Input defaultValue={user?.phone} className="h-14 rounded-2xl bg-black/20 border-white/5 font-bold tracking-widest" readOnly />
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Preferences Section */}
                <section className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Preferences</h3>
                    <div className="space-y-3">
                        <Card className="bg-surface/50 border border-white/5 rounded-3xl p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                    <Globe className="h-5 w-5 text-blue-500" />
                                    <p className="font-black italic text-white uppercase tracking-tighter">App Language</p>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {['English', 'Hindi', 'Marathi'].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setLanguage(lang)}
                                            className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${language === lang ? 'bg-primary text-background italic shadow-glow' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Card>

                        <Card
                            className="bg-surface/50 border border-white/5 rounded-3xl p-6 hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => setNotifications(!notifications)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-black italic text-white uppercase tracking-tighter">Notifications</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{notifications ? "Enabled" : "Disabled"}</p>
                                    </div>
                                </div>
                                <div className={`h-6 w-11 rounded-full transition-colors relative ${notifications ? 'bg-primary' : 'bg-charcoal'}`}>
                                    <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${notifications ? 'left-6' : 'left-1'}`} />
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="pt-4">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full h-16 rounded-2xl bg-alert/10 hover:bg-alert/20 text-alert font-black italic tracking-tight gap-3 border border-alert/10"
                    >
                        <LogOut className="h-5 w-5" /> LOG OUT FROM SESSION
                    </Button>
                </section>

                {/* Developer Credit */}
                <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-30 py-8 leading-relaxed">
                    Samarth OS v1.0 <br /> Made with Trust by Rishabh Ajay Sonawane
                </p>
            </div>
        </div>
    )
}
