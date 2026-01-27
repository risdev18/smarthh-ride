"use client"

import { ReactNode, useState } from "react"
import { useUserStore } from "@/lib/store/useUserStore"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Users,
    ShieldCheck,
    FileText,
    LayoutDashboard,
    Settings,
    LogOut,
    Car,
    Bell,
    Menu,
    X,
    Terminal
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, logout } = useUserStore()
    const router = useRouter()
    const pathname = usePathname()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    if (!user || user.role !== 'admin') {
        return null
    }

    const navItems = [
        { label: 'Overview', icon: LayoutDashboard, href: '/admin' },
        { label: 'Pilots', icon: ShieldCheck, href: '/admin/drivers' },
        { label: 'Users', icon: Users, href: '/admin/passengers' },
        { label: 'Logistics', icon: FileText, href: '/admin/rides' },
    ]

    return (
        <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-slate-900 border-r border-white/5 z-[101] transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Terminal className="text-black h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter text-white">SMARTH<span className="text-primary italic">CORE</span></h1>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">ADMIN v4.0</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 overflow-y-auto mt-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                                <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group relative overflow-hidden ${isActive ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                                    {isActive && <motion.div layoutId="nav-active" className="absolute left-0 w-1 h-6 bg-primary rounded-full" />}
                                    <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-slate-600 group-hover:text-slate-400'}`} />
                                    <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                        <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs text-primary">AD</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-white truncate uppercase italic">Rishabh Admin</p>
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest truncate">Global Command</p>
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black text-xs uppercase tracking-widest"
                    >
                        <LogOut className="h-5 w-5" />
                        TERMINATE SESSION
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-950 relative overflow-hidden">
                {/* HUD Header */}
                <header className="h-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sm:px-10 shrink-0 z-50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-transform"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter text-white italic">
                            {navItems.find(n => n.href === pathname)?.label || 'Console'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <button className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-primary transition-colors relative">
                            <Bell className="h-5 w-5" />
                            <div className="absolute top-3 right-3 h-2 w-2 bg-red-500 rounded-full ring-4 ring-slate-950" />
                        </button>
                        <div className="hidden sm:block text-right">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest">JAN-20-2026</p>
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">HUB SYNC ACTIVE</p>
                        </div>
                    </div>
                </header>

                {/* Viewport content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 no-scrollbar">
                    {children}
                </div>

                {/* Footer Nav for Mobile */}
                <nav className="lg:hidden h-20 bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-4 shrink-0 z-50">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1.5 min-w-[60px]">
                                <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-slate-600'}`} />
                                <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-slate-700'}`}>{item.label}</span>
                            </Link>
                        )
                    })}
                    <button onClick={() => logout()} className="flex flex-col items-center gap-1.5 min-w-[60px]">
                        <LogOut className="h-5 w-5 text-red-500/60" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-red-500/60">OUT</span>
                    </button>
                </nav>
            </main>
        </div>
    )
}
