"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDriverStore } from "@/lib/store/useDriverStore"
import { useUserStore } from "@/lib/store/useUserStore"
import {
    ArrowLeft, User, Phone, CreditCard, Truck, Upload, Camera,
    CheckCircle, ShieldCheck, Mail, Loader2, X, Image as ImageIcon,
    ArrowRight, MapPin, Calendar, FileText, BadgeCheck
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function DriverRegister() {
    const router = useRouter()
    const { setDriver } = useDriverStore()
    const { logout: logoutUser } = useUserStore()
    const [step, setStep] = useState(1) // 1: Details, 2: Documents
    const [loading, setLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Form Details State (Expanded based on REAL-WORLD requirements)
    const [form, setForm] = useState({
        name: "",
        phone: "",
        dob: "",
        address: "",
        city: "",
        aadhaar: "",
        dlNumber: "",
        dlExpiry: "",
        vehicleNumber: "",
    })

    // Documents State (Actual Files/URLs)
    const [docs, setDocs] = useState<Record<string, string | null>>({
        aadhaarFront: null,
        aadhaarBack: null,
        dlFront: null,
        dlBack: null,
        rc: null,
        insurance: null,
        puc: null,
        profilePhoto: null,
    })

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [activeDocField, setActiveDocField] = useState<string | null>(null)

    // Triggers actual file browser
    const handleFileTrigger = (field: string) => {
        setActiveDocField(field)
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && activeDocField) {
            // Create a local preview URL
            const url = URL.createObjectURL(file)
            setDocs(prev => ({ ...prev, [activeDocField]: url }))

            // Log to simulate real upload
            console.log(`Local file selected for ${activeDocField}:`, file.name)
        }
    }

    const isStep1Valid = form.name && form.phone.length === 10 && form.aadhaar.length === 12 && form.vehicleNumber && form.dlNumber && form.city
    const isStep2Valid = docs.aadhaarFront && docs.aadhaarBack && docs.dlFront && docs.dlBack && docs.rc && docs.insurance && docs.puc && docs.profilePhoto

    const handleFinalSubmit = async () => {
        setLoading(true)

        const driverData = {
            id: "DR_" + Date.now(),
            name: form.name,
            phone: "+91 " + form.phone,
            dob: form.dob,
            address: form.address,
            city: form.city,
            aadhaarNumber: form.aadhaar,
            dlNumber: form.dlNumber,
            dlExpiry: form.dlExpiry,
            vehicleNumber: form.vehicleNumber,
            vehicleType: "Auto Rickshaw",
            verificationStatus: "pending" as const,
            documents: Object.entries(docs).reduce((acc, [key, url]) => ({
                ...acc,
                [key]: { status: 'pending', url: url || '' }
            }), {})
        }

        // --- EMAIL SIMULATION LOGIC ---
        console.log("%c--- NEW DRIVER REGISTRATION ---", "color: #F5C842; font-weight: bold; font-size: 16px;")
        console.log("Recipient: rishabhsonawane2007@gmail.com")
        console.log("Subject: New Driver Registration – Smart Rides")
        console.log("Registration Content:", {
            driver_info: {
                ...form,
                phone: "+91 " + form.phone
            },
            verification_documents: docs
        })
        console.log("%cStatus: Package pending admin approval.", "color: #4ade80;")

        await new Promise(resolve => setTimeout(resolve, 3000))

        setDriver(driverData)
        setLoading(false)
        setIsSubmitted(true)

        setTimeout(() => {
            router.push("/driver/dashboard")
        }, 4000)
    }

    if (isSubmitted) {
        return (
            <div className="h-screen bg-background flex flex-col items-center justify-center p-8 text-center space-y-8">
                <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} className="h-40 w-40 bg-primary rounded-[3rem] flex items-center justify-center shadow-glow">
                    <BadgeCheck className="h-20 w-20 text-background stroke-[2.5px]" />
                </motion.div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-white italic tracking-tight">Application <span className="text-primary not-italic">Received</span></h1>
                    <p className="text-muted-foreground font-medium max-w-[300px] mx-auto leading-relaxed">Your KYC documents have been submitted to <span className="text-white">our safety team</span> for manual verification. This usually takes 24-48 hours.</p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-[280px]">
                    <div className="flex items-center justify-center gap-3 px-6 py-3 glass rounded-2xl opacity-80 border border-white/10">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-[12px] font-black uppercase tracking-widest text-white italic">Verifying Profile...</span>
                    </div>
                    <Button variant="secondary" className="h-16 rounded-2xl opacity-60 hover:opacity-100" onClick={() => {
                        logoutUser();
                        window.location.href = '/';
                    }}>Go Back Home</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-white p-6 font-sans pb-40">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            <div className="flex items-center justify-between mb-8 pt-4">
                <button onClick={() => step === 1 ? router.back() : setStep(1)} className="h-12 w-12 glass rounded-2xl flex items-center justify-center">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-black text-white italic">Partner <span className="text-primary not-italic">Setup</span></h1>
                    <div className="flex gap-2 mt-2 justify-center">
                        <div className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step === 1 ? 'bg-primary' : 'bg-charcoal'}`} />
                        <div className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step === 2 ? 'bg-primary shadow-glow' : 'bg-charcoal'}`} />
                    </div>
                </div>
                <div className="w-12" />
            </div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">1. Personal <span className="text-primary not-italic">Identity</span></h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Provide your legal details as per Aadhaar</p>
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                            <FormGroup label="FULL NAME" icon={User}>
                                <Input placeholder="Amit Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </FormGroup>

                            <div className="grid grid-cols-2 gap-4">
                                <FormGroup label="MOBILE" icon={Phone}>
                                    <Input placeholder="98XXXXXXXX" maxLength={10} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })} />
                                </FormGroup>
                                <FormGroup label="CITY" icon={MapPin}>
                                    <Input placeholder="e.g. Pune" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                                </FormGroup>
                            </div>

                            <FormGroup label="FULL ADDRESS" icon={MapPin}>
                                <Input placeholder="House No, Colony, Landmark" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                            </FormGroup>

                            <div className="h-[1px] bg-white/5 my-2" />

                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">2. Licensing <span className="text-primary not-italic">& Vehicle</span></h2>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Enter document numbers for verification</p>
                            </div>

                            <FormGroup label="DL NUMBER" icon={FileText}>
                                <Input placeholder="MH12XXXXXXX" value={form.dlNumber} onChange={e => setForm({ ...form, dlNumber: e.target.value.toUpperCase() })} />
                            </FormGroup>

                            <div className="grid grid-cols-2 gap-4">
                                <FormGroup label="AADHAAR" icon={CreditCard}>
                                    <Input placeholder="12 Digit No" maxLength={12} value={form.aadhaar} onChange={e => setForm({ ...form, aadhaar: e.target.value.replace(/\D/g, '') })} />
                                </FormGroup>
                                <FormGroup label="VEHICLE NO" icon={Truck}>
                                    <Input placeholder="MH 12 AB 1234" value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })} />
                                </FormGroup>
                            </div>
                        </div>

                        <Button variant="premium" className="w-full h-20 text-xl font-black rounded-3xl mt-6 shadow-glow italic" disabled={!isStep1Valid} onClick={() => setStep(2)}>
                            PROCEED TO UPLOADS <ArrowRight className="ml-2 h-6 w-6" />
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">3. Documents <span className="text-primary not-italic">(KYC)</span></h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Total 8 clear photos required</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <UploadCard label="Aadhaar Front" preview={docs.aadhaarFront} onClick={() => handleFileTrigger('aadhaarFront')} />
                            <UploadCard label="Aadhaar Back" preview={docs.aadhaarBack} onClick={() => handleFileTrigger('aadhaarBack')} />
                            <UploadCard label="DL Front" preview={docs.dlFront} onClick={() => handleFileTrigger('dlFront')} />
                            <UploadCard label="DL Back" preview={docs.dlBack} onClick={() => handleFileTrigger('dlBack')} />
                            <UploadCard label="Vehicle RC" preview={docs.rc} onClick={() => handleFileTrigger('rc')} />
                            <UploadCard label="Insurance" preview={docs.insurance} onClick={() => handleFileTrigger('insurance')} />
                            <UploadCard label="PUC Photo" preview={docs.puc} onClick={() => handleFileTrigger('puc')} />
                            <UploadCard label="Driver Selfie" preview={docs.profilePhoto} onClick={() => handleFileTrigger('profilePhoto')} />
                        </div>

                        <div className="glass p-5 rounded-3xl flex gap-4 border border-primary/10">
                            <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
                            <p className="text-[11px] font-black text-muted-foreground uppercase leading-relaxed tracking-wider italic">
                                I confirm these documents are valid under Indian Motor Vehicle laws. Smarth Rides <span className="text-white">will verify</span> these manually.
                            </p>
                        </div>

                        <Button
                            variant="premium"
                            className="w-full h-24 text-2xl font-black rounded-[2.5rem] mt-6 shadow-glow italic"
                            disabled={!isStep2Valid || loading}
                            onClick={handleFinalSubmit}
                        >
                            {loading ? <><Loader2 className="animate-spin mr-3 h-8 w-8" /> PROCESSING...</> : "VERIFY & SUBMIT"}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function FormGroup({ label, icon: Icon, children }: { label: string, icon: any, children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-1.5 ml-1">
                <Icon className="h-3.5 w-3.5 text-primary" />
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</label>
            </div>
            {children}
        </div>
    )
}

function UploadCard({ label, onClick, preview }: { label: string, onClick: () => void, preview: string | null }) {
    return (
        <motion.div
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            className="h-36 glass rounded-[2.5rem] border border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-4 cursor-pointer hover:border-primary/30 transition-colors group"
        >
            {preview ? (
                <>
                    <img src={preview} className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:opacity-10 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                            <CheckCircle className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter italic">{label}</span>
                        <span className="text-[8px] font-bold text-primary uppercase">EDIT</span>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                        <Camera className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{label}</span>
                </div>
            )}
        </motion.div>
    )
}
