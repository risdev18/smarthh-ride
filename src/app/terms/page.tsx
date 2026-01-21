"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Gavel, ShieldCheck } from "lucide-react"

export default function TermsPage() {
    const router = useRouter()

    const sections = [
        {
            title: "Platform Nature",
            content: "Samarth Ride is strictly a booking facilitator. We connect passengers with independent drivers. We do not own vehicles or employ drivers."
        },
        {
            title: "Payment Policy",
            content: "All ride payments are made directly from the passenger to the driver via cash or personal UPI. Samarth Ride does not collect ride fares or charge commission at this stage."
        },
        {
            title: "Safety & Conduct",
            content: "Users must behave professionally. Any report of harassment or dangerous driving will lead to an permanent immediate ban from the platform."
        },
        {
            title: "Liability Disclaimer",
            content: "Samarth Ride and its developer (Rishabh Ajay Sonawane) are not liable for any accidents, disputes, or losses occurring during a ride. Safety is a mutual responsibility."
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
                    <h1 className="text-3xl font-black italic tracking-tight">Terms of <span className="text-primary not-italic">Service</span></h1>
                </div>

                <div className="space-y-8">
                    {sections.map((section, i) => (
                        <div key={i} className="space-y-3">
                            <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-primary italic">
                                <Gavel className="h-4 w-4" /> {section.title}
                            </h3>
                            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl">
                                <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                    {section.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2.5rem] flex items-center gap-4">
                    <ShieldCheck className="text-primary h-8 w-8" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">By using Samarth Ride, you agree to these ethical guidelines for a better community.</p>
                </div>

                <p className="text-center text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30 pb-12">
                    Last Updated: January 2026 · Samarth Ride Legal
                </p>
            </div>
        </div>
    )
}
