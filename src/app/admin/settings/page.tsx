"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Shield, Bell, Database, Save, Globe } from "lucide-react"

export default function AdminSettings() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black text-white italic tracking-tight">Console <span className="text-primary not-italic">Settings</span></h1>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-2">Manage your Smarth Rides Administrative Environment</p>
            </div>

            <div className="grid gap-8 max-w-4xl">
                {/* General Settings */}
                <Card className="rounded-[3rem] border-white/5 bg-surface/40 backdrop-blur-3xl overflow-hidden">
                    <CardHeader className="bg-charcoal/30 p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Globe className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black text-white italic">General Configuration</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Main platform parameters</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Platform Name</label>
                                <Input defaultValue="Smarth Rides" className="h-14 rounded-2xl bg-charcoal/50 border-white/5 font-bold text-white italic" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Admin Alert Email</label>
                                <Input defaultValue="admin@smarthrides.in" className="h-14 rounded-2xl bg-charcoal/50 border-white/5 font-bold text-white italic" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Safety & Security */}
                <Card className="rounded-[3rem] border-white/5 bg-surface/40 backdrop-blur-3xl overflow-hidden">
                    <CardHeader className="bg-charcoal/30 p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-alert/10 flex items-center justify-center text-alert">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black text-white italic">Security & Compliance</CardTitle>
                                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">KYC and Auto-Approve rules</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                            <div>
                                <h4 className="font-black text-white italic">Strict Document Verification</h4>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Require manual admin check for all new drivers</p>
                            </div>
                            <div className="h-8 w-14 bg-primary rounded-full relative p-1 group cursor-pointer transition-all">
                                <div className="absolute right-1 top-1 h-6 w-6 bg-background rounded-full shadow-lg" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 font-black text-[10px] uppercase tracking-widest">Reset Changes</Button>
                    <Button className="h-16 px-12 rounded-2xl bg-primary text-background font-black text-lg italic shadow-glow hover:scale-[1.02] transition-all">
                        <Save className="mr-2 h-5 w-5" /> SAVE SETTINGS
                    </Button>
                </div>
            </div>
        </div>
    )
}
