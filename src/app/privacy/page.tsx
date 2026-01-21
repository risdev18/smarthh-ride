"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react"

export default function PrivacyPage() {
    const router = useRouter()

    const policies = [
        {
            icon: Eye,
            title: "Data We Collect",
            content: "We only collect essential data: your name, phone number, and driver KYC documents to verify identity and ensure platform safety."
        },
        {
            icon: Lock,
            title: "Encryption",
            content: "Your sensitive documents and passwords are encrypted and stored securely using Google Cloud infrastructure. We never share your contact details with 3rd party advertisers."
        },
        {
            icon: Database,
            title: "Data Purpose",
            content: "Passenger phone numbers are only shared with the matched driver to facilitate the pickup. Driver details are visible to passengers only after booking confirmation."
        }
    ]

    return (
        <div className="min-h-screen bg-background text-white p-6 md:p-12 font-sans">
            <div className="max-w-md mx-auto space-y-10">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/5"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-3xl font-black italic tracking-tight">Privacy <span className="text-primary not-italic">Policy</span></h1>
                </div>

                <div className="space-y-6">
                    {policies.map((policy, i) => (
                        <div key={i} className="bg-surface/50 border border-white/5 p-8 rounded-[2.5rem] space-y-4 backdrop-blur-3xl">
                            <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <policy.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-black italic text-white uppercase tracking-tighter">{policy.title}</h3>
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                                "{policy.content}"
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-charcoal border border-white/5 p-6 rounded-3xl text-center">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Your data stays in India 🇮🇳</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">Managed by Saffar Labs Security Protocols</p>
                </div>

                <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30 pb-12">
                    Made for Trust · Rishabh Ajay Sonawane Initiative
                </p>
            </div>
        </div>
    )
}
