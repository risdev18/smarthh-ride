"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Navigation, Menu } from "lucide-react"
import { useUserStore } from "@/lib/store/useUserStore"

// Dynamic import for Map to avoid SSR window error
const Map = dynamic(() => import("@/components/map/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-200 animate-pulse flex items-center justify-center text-slate-600 font-bold">Loading Map...</div>
})

export default function PassengerHome() {
    const router = useRouter()
    const { user, logout } = useUserStore()

    // Auth Check
    useEffect(() => {
        if (!user) {
            router.push("/")
        }
    }, [user, router])

    const [location] = useState({ lat: 18.5204, lng: 73.8567 })

    if (!user) return null

    return (
        <div className="relative h-screen w-full flex flex-col overflow-hidden">
            {/* FULL-SCREEN MAP */}
            <div className="absolute inset-0 z-0">
                <Map center={location} />
            </div>

            {/* Top Bar - Minimal */}
            <div className="relative z-20 p-4 pt-8 flex items-center justify-between">
                <div className="relative group">
                    <button
                        className="h-12 w-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <Menu className="h-6 w-6 text-slate-800" />
                    </button>

                    {/* Simple Logout Dropdown */}
                    <div className="absolute top-14 left-0 w-48 bg-white rounded-2xl shadow-xl p-2 hidden group-focus-within:block">
                        <div className="px-4 py-2 border-b border-slate-100 mb-2">
                            <p className="font-bold text-sm">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.phone}</p>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                router.push("/");
                            }}
                            className="w-full text-left px-4 py-2 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Small "No Surge" Badge */}
                <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm">
                    ✓ No surge. Fixed fare.
                </div>
            </div>

            {/* Center - Blue Dot (User Location) - Simulated */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                    <div className="h-6 w-6 bg-blue-500 rounded-full border-4 border-white shadow-xl animate-pulse"></div>
                    <div className="absolute inset-0 h-6 w-6 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                </div>
            </div>

            {/* Bottom - "Where to?" Input + Quick Actions */}
            <div className="mt-auto relative z-20 p-4 pb-8 space-y-4">
                {/* Recenter Button */}
                <div className="flex justify-end">
                    <button className="h-14 w-14 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform">
                        <Navigation className="h-7 w-7 text-slate-800" />
                    </button>
                </div>

                {/* Main Input Card */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl space-y-4">
                    {/* Where to? Input */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Search className="h-6 w-6 text-yellow-500" />
                        </div>
                        <input
                            readOnly
                            className="w-full h-16 bg-slate-50 border-2 border-slate-200 focus:border-yellow-500 rounded-2xl pl-14 pr-4 text-lg font-bold text-slate-900 placeholder:text-slate-400 outline-none cursor-pointer transition-all"
                            placeholder="Where to?"
                            onClick={() => router.push('/passenger/book')}
                        />
                    </div>

                    {/* Recent/Quick Locations - 1 TAP */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide px-2">Quick Access</p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { name: 'Hospital', icon: '🏥' },
                                { name: 'Railway Station', icon: '🚉' },
                                { name: 'Market', icon: '🛒' },
                                { name: 'Bus Stand', icon: '🚌' }
                            ].map((place) => (
                                <button
                                    key={place.name}
                                    onClick={() => router.push('/passenger/book')}
                                    className="flex items-center gap-2 bg-slate-50 hover:bg-yellow-50 border border-slate-200 hover:border-yellow-400 px-4 py-3 rounded-xl transition-all active:scale-95"
                                >
                                    <span className="text-2xl">{place.icon}</span>
                                    <span className="font-bold text-slate-900 text-sm">{place.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
