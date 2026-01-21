"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Lock, ArrowRight, MapPin } from "lucide-react"
import { passengerService } from "@/lib/services/passengerService"
import { useUserStore } from "@/lib/store/useUserStore"

export default function PassengerLogin() {
    const router = useRouter()
    const { setUser } = useUserStore()

    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        // Direct Login Mock
        if (phone === "9999999999") {
            setUser({ id: "demo_user", name: "Demo User", phone: "+91 " + phone, role: 'passenger', isApproved: true })
            router.push("/passenger")
            return
        }

        if (phone.length !== 10 || !password) return

        setLoading(true)
        try {
            const user = await passengerService.verifyCredentials("+91 " + phone, password)
            if (user) {
                setUser({
                    id: user.id || "unknown",
                    name: user.name,
                    phone: user.phone,
                    role: 'passenger',
                    isApproved: true
                })
                router.push("/passenger")
            } else {
                alert("Invalid Mobile Number or Password")
            }
        } catch (e) {
            console.error(e)
            alert("Login Failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-screen p-6 justify-between bg-white text-black">
            <div className="space-y-6 mt-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-yellow-400 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <MapPin className="h-10 w-10 text-black fill-black" />
                    </div>
                    <h1 className="text-4xl font-black text-center tracking-tighter">
                        SMARTH <span className="text-yellow-500">RIDES</span>
                    </h1>
                </div>
                <div className="text-center text-lg font-bold text-zinc-500">
                    Your City, Your Ride.
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold ml-1 text-zinc-500 uppercase tracking-wider">Mobile Number</label>
                    <div className="flex gap-3">
                        <div className="h-14 w-16 flex items-center justify-center bg-gray-100 rounded-xl font-bold text-lg border-2 border-transparent">
                            +91
                        </div>
                        <Input
                            type="tel"
                            placeholder="98765 43210"
                            className="flex-1 h-14 bg-gray-100 border-2 border-transparent focus:border-black text-xl font-bold tracking-widest placeholder:text-gray-400 rounded-xl transition-all"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold ml-1 text-zinc-500 uppercase tracking-wider">Password</label>
                    <div className="relative">
                        <Input
                            type="password"
                            placeholder="Enter Password"
                            className="h-14 bg-gray-100 border-2 border-transparent focus:border-black text-xl font-bold placeholder:text-gray-400 rounded-xl pl-12 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                <Button
                    className="w-full h-14 text-xl font-black bg-black text-white hover:bg-zinc-800 rounded-xl shadow-[4px_4px_0px_0px_rgba(255,215,0,1)] transition-all active:translate-y-1 active:shadow-none"
                    size="lg"
                    onClick={handleLogin}
                    disabled={phone.length !== 10 || !password || loading}
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <span className="flex items-center gap-2">
                            LOGIN <ArrowRight className="h-5 w-5" />
                        </span>
                    )}
                </Button>

                <div className="text-center pt-2 space-y-4">
                    <div>
                        <p className="text-zinc-500 text-sm font-bold">New here?</p>
                        <button
                            onClick={() => router.push("/passenger/register")}
                            className="text-black font-black underline mt-1 text-lg"
                        >
                            Create Account
                        </button>
                    </div>

                    <div className="pt-4 border-t border-zinc-100">
                        <button
                            onClick={() => router.push("/")}
                            className="text-primary font-black uppercase tracking-widest text-xs py-2 px-6 bg-slate-950 rounded-full shadow-lg"
                        >
                            Switch to Driver / Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
