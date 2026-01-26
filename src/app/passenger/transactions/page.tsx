"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CreditCard, IndianRupee, TrendingUp, Calendar, ChevronRight, Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

export default function TransactionsPage() {
    const router = useRouter()

    const transactions = [
        { id: "TXN10243", date: "25 Jan 2026", amount: 145, method: "CASH", type: "RIDE", status: "Success" },
        { id: "TXN10242", date: "24 Jan 2026", amount: 230, method: "UPI", type: "RIDE", status: "Success" },
        { id: "TXN10241", date: "24 Jan 2026", amount: 120, method: "CASH", type: "RIDE", status: "Success" },
    ]

    return (
        <div className="min-h-screen bg-background text-white p-6 pb-20 font-sans">
            <div className="flex items-center gap-6 mb-10 bg-surface/30 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-xl">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight">System <span className="text-primary not-italic">Billing</span></h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mt-1">Cash and Digital ride logs</p>
                </div>
            </div>

            <div className="space-y-6">
                <Card className="rounded-[3.5rem] bg-surface/40 border-white/5 p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Spends</p>
                            <h2 className="text-4xl font-black italic">₹495.00</h2>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Wallet className="h-7 w-7" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-white/40">3 Transactions this week</span>
                    </div>
                </Card>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] pl-4">Recent Activity</h4>
                    {transactions.map((txn, i) => (
                        <motion.div
                            key={txn.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="rounded-3xl border-white/5 bg-surface p-5 flex items-center justify-between group hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        {txn.method === 'CASH' ? <IndianRupee className="h-6 w-6" /> : <CreditCard className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-white tracking-tight italic uppercase">{txn.method} PAYMENT</h3>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{txn.date} • {txn.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-white italic leading-none mb-1">₹{txn.amount}</p>
                                    <p className="text-[8px] font-black uppercase text-green-500 tracking-widest">{txn.status}</p>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] text-white/5 mt-20 italic">Transparent Billing • Samarth Ride</p>
        </div>
    )
}
