"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Power, Phone, CheckCircle, Wallet, Star, TrendingUp } from "lucide-react"
import { useUserStore } from "@/lib/store/useUserStore"
import { motion, AnimatePresence } from "framer-motion"

export default function SimpleDriverHome() {
    const router = useRouter()
    const { user, logout } = useUserStore()

    const [isOnline, setIsOnline] = useState(false)
    const [todayEarnings, setTodayEarnings] = useState(0)
    const [ridesCompleted, setRidesCompleted] = useState(0)

    // Auth check
    useEffect(() => {
        if (!user || user.role !== 'driver') {
            router.push("/")
        }
    }, [user, router])

    if (!user) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 flex flex-col p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="text-white">
                    <h1 className="text-2xl font-black">SmarthRides</h1>
                    <p className="text-sm font-bold opacity-90">Driver</p>
                </div>
                <button
                    onClick={logout}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-bold text-sm"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center space-y-6">
                {/* Today's Earnings - BIG */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl text-center">
                    <p className="text-slate-600 font-bold text-sm mb-2">TODAY'S EARNINGS</p>
                    <h2 className="text-6xl font-black text-slate-900">₹{todayEarnings}</h2>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-6 text-center">
                        <p className="text-slate-600 font-bold text-xs mb-2">RIDES COMPLETED</p>
                        <h3 className="text-4xl font-black text-slate-900">{ridesCompleted}</h3>
                    </div>
                    <div className="bg-white rounded-2xl p-6 text-center">
                        <p className="text-slate-600 font-bold text-xs mb-2">RATING</p>
                        <div className="flex items-center justify-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            <h3 className="text-4xl font-black text-slate-900">4.8</h3>
                        </div>
                    </div>
                </div>

                {/* GO ONLINE Button - MASSIVE */}
                <button
                    onClick={() => setIsOnline(!isOnline)}
                    className={`w-full h-24 rounded-3xl font-black text-2xl uppercase tracking-tight shadow-2xl transition-all transform active:scale-95 ${isOnline
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-slate-900'
                        }`}
                >
                    <div className="flex items-center justify-center gap-3">
                        <Power className="w-8 h-8" />
                        {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
                    </div>
                </button>

                {/* Online Status Indicator */}
                {isOnline && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500 text-white rounded-2xl p-6 text-center"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            <p className="font-black text-lg">YOU ARE ONLINE</p>
                        </div>
                        <p className="text-sm font-semibold opacity-90">Waiting for ride requests...</p>
                    </motion.div>
                )}
            </div>

            {/* Bottom Info */}
            <div className="text-center text-white/80 text-sm font-semibold">
                <p>Driver: {user.name}</p>
                <p>Vehicle: {user.vehicleNumber || 'Not set'}</p>
            </div>
        </div>
    )
}
