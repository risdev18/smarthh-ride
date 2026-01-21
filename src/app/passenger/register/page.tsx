"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Lock, ArrowRight, MapPin, User, Phone } from "lucide-react"
import { passengerService } from "@/lib/services/passengerService"

export default function PassengerRegister() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)

    const handleRegister = async () => {
        if (!formData.name || formData.phone.length !== 10 || !formData.password) return

        setLoading(true)
        try {
            await passengerService.addPassenger({
                name: formData.name,
                phone: "+91 " + formData.phone,
                password: formData.password
            })
            alert("Account Created! Please Login.")
            router.push("/passenger/login")
        } catch (e) {
            console.error(e)
            alert("Registration Failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen p-6 bg-white text-black">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-100">
                    <ArrowRight className="h-6 w-6 rotate-180" />
                </Button>
                <div>
                    <h1 className="text-2xl font-black">Join Smarth Rides</h1>
                    <p className="text-zinc-500 text-sm">Create your passenger account</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold ml-1 text-zinc-500 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                        <Input
                            placeholder="e.g. Aditi Sharma"
                            className="h-14 bg-gray-100 border-2 border-transparent focus:border-black text-lg font-bold placeholder:text-gray-400 rounded-xl pl-12"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold ml-1 text-zinc-500 uppercase tracking-wider">Mobile Number</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <span className="text-zinc-400 font-bold">+91</span>
                        </div>
                        <Input
                            type="tel"
                            placeholder="98765 43210"
                            className="h-14 bg-gray-100 border-2 border-transparent focus:border-black text-lg font-bold placeholder:text-gray-400 rounded-xl pl-24"
                            maxLength={10}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold ml-1 text-zinc-500 uppercase tracking-wider">Set Password</label>
                    <div className="relative">
                        <Input
                            type="password"
                            placeholder="Min 6 characters"
                            className="h-14 bg-gray-100 border-2 border-transparent focus:border-black text-lg font-bold placeholder:text-gray-400 rounded-xl pl-12"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        className="w-full h-14 text-xl font-black bg-black text-white hover:bg-zinc-800 rounded-xl shadow-[4px_4px_0px_0px_rgba(255,215,0,1)] transition-all active:translate-y-1 active:shadow-none"
                        size="lg"
                        onClick={handleRegister}
                        disabled={!formData.name || formData.phone.length !== 10 || !formData.password || loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "CREATE ACCOUNT"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
