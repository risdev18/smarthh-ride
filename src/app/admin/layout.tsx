"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { FileText, Users, Map, BarChart, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store/useUserStore"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const { logout } = useUserStore()

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const navItems = [
        { name: "Overview", href: "/admin", icon: BarChart },
        { name: "Documents", href: "/admin/documents", icon: FileText },
        { name: "Drivers", href: "/admin/drivers", icon: Users },
        { name: "Areas", href: "/admin/areas", icon: Map },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ]

    return (
        <div className="min-h-screen flex bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="text-2xl font-bold text-primary italic">Samarth <span className="text-white">Admin</span></h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-base font-medium",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground shadow-glow shadow-primary/20"
                                    : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="h-5 w-5" />
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-background">
                <header className="md:hidden h-16 border-b border-white/5 flex items-center justify-between px-4 bg-surface/50 backdrop-blur-md">
                    <span className="font-black italic text-primary">SAMARTH <span className="text-white">ADMIN</span></span>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </header>
                <div className="p-6 md:p-10 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
