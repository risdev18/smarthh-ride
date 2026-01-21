"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RedirectToRegister() {
    const router = useRouter()

    useEffect(() => {
        router.replace("/driver/register")
    }, [router])

    return (
        <div className="h-screen bg-background flex items-center justify-center">
            <div className="animate-pulse text-primary font-black uppercase tracking-[0.3em] italic">
                Switching to Smarth Setup...
            </div>
        </div>
    )
}
