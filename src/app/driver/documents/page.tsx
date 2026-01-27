"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Upload,
    CheckCircle,
    FileText,
    AlertCircle,
    ArrowLeft,
    ShieldCheck,
    Trash2,
    Eye,
    Loader2,
    Sparkles,
    Lock,
    CarFront
} from "lucide-react"
import { useUserStore } from "@/lib/store/useUserStore"
import { storageService } from "@/lib/services/storageService"
import { driverService } from "@/lib/services/driverService"
import { notificationService } from "@/lib/services/notificationService"
import { motion, AnimatePresence } from "framer-motion"

export default function DriverDocuments() {
    const router = useRouter()
    const { user, setUser } = useUserStore()
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState("")

    // Document State
    const [uploads, setUploads] = useState<{ [key: string]: { file: File, preview: string } }>({})
    const [vehicleNumber, setVehicleNumber] = useState(user?.vehicleNumber || "")

    const documentConfigs = [
        { id: 'licenseUrl', label: 'Driving License', icon: FileText, desc: 'Clear photo of the front side' },
        { id: 'rcBookUrl', label: 'RC Book (Vehicle Registration)', icon: ShieldCheck, desc: 'Registration Certificate front' },
        { id: 'insuranceUrl', label: 'Insurance Copy', icon: Lock, desc: 'Valid insurance document' }
    ]

    const handleFileChange = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const preview = URL.createObjectURL(file)
            setUploads(prev => ({ ...prev, [docId]: { file, preview } }))
        }
    }

    const removeFile = (docId: string) => {
        setUploads(prev => {
            const next = { ...prev }
            delete next[docId]
            return next
        })
    }

    const handleSubmit = async () => {
        if (!user) return
        if (Object.keys(uploads).length < 3) {
            alert("Please upload all 3 required documents.")
            return
        }
        if (!vehicleNumber.replace(/\s/g, '').trim()) {
            alert("Please provide a valid Vehicle Number.")
            return
        }

        setUploading(true)
        try {
            const documentUrls: any = {}
            const docKeys = Object.keys(uploads)

            for (let i = 0; i < docKeys.length; i++) {
                const docId = docKeys[i]
                const docConfig = documentConfigs.find(d => d.id === docId)
                setUploadProgress(`Processing ${docConfig?.label}...`)

                try {
                    const base64Data = await storageService.uploadDriverDocument(
                        user.id,
                        docId,
                        uploads[docId].file
                    )
                    documentUrls[docId] = base64Data
                } catch (err: any) {
                    throw new Error(`Failed to process ${docConfig?.label}.`)
                }
            }

            setUploadProgress("Syncing Database...")
            await driverService.updateDriverDocuments(user.id, documentUrls, vehicleNumber)

            setUploadProgress("Notifying Operations...")
            await notificationService.sendNewDriverNotification({
                name: user.name,
                phone: user.phone,
                vehicleNumber: vehicleNumber,
                documents: documentUrls
            })

            setUser({ ...user, status: 'pending', isApproved: false, vehicleNumber: vehicleNumber })
            setUploadProgress("Verified!")

            setTimeout(() => {
                router.push("/driver/dashboard")
            }, 1000)

        } catch (e: any) {
            console.error(e)
            setUploadProgress("Error")
            alert(`APPLICATION ERROR: ${e.message}`)
        } finally {
            setUploading(false)
        }
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary selection:text-black">
            <div className="max-w-5xl mx-auto p-4 sm:p-8 lg:p-12">
                {/* Header Area */}
                <header className="mb-8 sm:mb-12">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 sm:mb-8 group h-11"
                    >
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Hub</span>
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] balance-text">
                                SECURE <br /> <span className="text-primary">VALIDATION</span>
                            </h1>
                            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs leading-none">
                                Compliance Standard v4.2.1-Node
                            </p>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 p-5 sm:p-6 rounded-3xl sm:rounded-[2.5rem] flex items-center gap-4 shadow-2xl self-start">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-2xl flex items-center justify-center ring-1 ring-primary/20">
                                <ShieldCheck className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status</p>
                                <h2 className="text-sm sm:text-lg font-black uppercase italic tracking-tight leading-none text-white">Action Required</h2>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {documentConfigs.map((doc) => {
                        const upload = uploads[doc.id]
                        return (
                            <Card key={doc.id} className="bg-slate-900/40 backdrop-blur-3xl border-white/5 rounded-[2rem] sm:rounded-[3rem] overflow-hidden group hover:border-primary/20 transition-all">
                                <CardContent className="p-0 flex flex-col h-full">
                                    <div className="p-6 sm:p-8 sm:pb-4">
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                            <doc.icon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-2">{doc.label}</h3>
                                        <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wide leading-relaxed">{doc.desc}</p>
                                    </div>

                                    <div className="px-6 sm:px-8 pb-6 sm:pb-8 mt-auto">
                                        {upload ? (
                                            <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group/preview">
                                                <img src={upload.preview} alt="Upload Preview" className="h-full w-full object-cover grayscale opacity-60 group-hover/preview:grayscale-0 group-hover/preview:opacity-100 transition-all duration-500" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center p-4">
                                                    <button
                                                        onClick={() => removeFile(doc.id)}
                                                        className="h-12 w-12 rounded-full bg-red-500 text-black flex items-center justify-center active:scale-90 transition-transform shadow-xl"
                                                    >
                                                        <Trash2 className="h-6 w-6" />
                                                    </button>
                                                </div>
                                                <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-lg">
                                                    <CheckCircle className="h-3 w-3 text-black" />
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer block">
                                                <div className="aspect-[4/3] rounded-2xl sm:rounded-3xl border-2 border-dashed border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group-hover:scale-[1.02]">
                                                    <Upload className="h-6 w-6 text-slate-600 group-hover:text-primary transition-colors" />
                                                    <span className="text-[9px] font-black text-slate-700 group-hover:text-primary uppercase tracking-[0.2em] transition-colors">Capture Photo</span>
                                                </div>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(doc.id, e)} />
                                            </label>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Final Form Area */}
                <div className="mt-8 sm:mt-12 bg-slate-900 border border-white/5 p-6 sm:p-10 lg:p-12 rounded-[2.5rem] sm:rounded-[4rem] relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-12 -right-12 opacity-5 pointer-events-none">
                        <Lock className="h-64 w-64 rotate-12" />
                    </div>

                    <div className="relative z-10 space-y-8 lg:space-y-12">
                        <div className="max-w-md">
                            <label className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                                <CarFront className="h-4 w-4" /> FLEET REGISTRATION NUMBER
                            </label>
                            <input
                                placeholder="MH 12 AB 1234"
                                className="w-full h-16 sm:h-20 bg-slate-950 border-2 border-slate-900 rounded-2xl px-6 sm:px-8 text-2xl sm:text-3xl font-black uppercase tracking-widest placeholder:text-slate-900 focus:border-primary transition-all text-white outline-none"
                                value={vehicleNumber}
                                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                            />
                            <p className="text-[9px] sm:text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-3">
                                State Code + District + Series + Number
                            </p>
                        </div>

                        <div className="pt-8 border-t border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-12">
                            <div className="max-w-lg">
                                <h3 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Legal Compliance</h3>
                                <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                    By deploying these credentials, you verify their authenticity under the IT Act 2000. Data is processed via E2E encryption protocols.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 min-w-0 flex-1 lg:max-w-md">
                                <button
                                    onClick={handleSubmit}
                                    disabled={uploading}
                                    className="h-16 sm:h-20 px-8 bg-primary text-black font-black text-lg sm:text-xl rounded-2xl sm:rounded-3xl shadow-xl shadow-primary/10 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100 flex-1 whitespace-nowrap"
                                >
                                    {uploading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>DEPLOY DATA <Sparkles className="h-5 w-5" /></>
                                    )}
                                </button>

                                {uploading && (
                                    <div className="flex-1 min-w-[120px]">
                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2 animate-pulse">{uploadProgress}</p>
                                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1 }} className="h-full w-1/3 bg-primary" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-12 sm:mt-16 text-center space-y-4">
                    <p className="text-slate-700 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em]">
                        SECURE HUB CONNECTION • BANGALORE • DEL • BOM
                    </p>
                    <div className="flex justify-center gap-4 opacity-20">
                        <div className="h-px w-8 bg-slate-800 self-center" />
                        <ShieldCheck className="h-4 w-4 text-slate-500" />
                        <div className="h-px w-8 bg-slate-800 self-center" />
                    </div>
                </footer>
            </div>
        </div>
    )
}
