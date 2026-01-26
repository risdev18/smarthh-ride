"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, User, Car } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppGuideProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: 'passenger' | 'driver';
}

export default function AppGuide({ isOpen, onClose, defaultTab = 'passenger' }: AppGuideProps) {
    const [activeTab, setActiveTab] = useState<'passenger' | 'driver'>(defaultTab)
    const [step, setStep] = useState(0)

    const passengerSteps = [
        {
            title: "1. Pickup Location (कुठून जायचं?)",
            desc: "Use your GPS location or type a landmark like 'Hanuman Mandir'.",
            img: "/images/guide/guide_pickup.png"
        },
        {
            title: "2. Ride Type (कोणती ट्रिप?)",
            desc: "Select 'One Way' or 'Return'. Return rides save money!",
            img: "/images/guide/guide_ride_type.png"
        },
        {
            title: "3. Confirm & Call (पुष्टी करा)",
            desc: "See fixed fare. Call driver directly if needed.",
            img: "/images/guide/guide_confirm.png"
        }
    ]

    const driverSteps = [
        {
            title: "1. Go Online (ऑनलाईन व्हा)",
            desc: "Tap the green button to start receiving rides.",
            img: "/images/guide/guide_driver.png"
        },
        {
            title: "2. Accept Ride (राईड स्वीकारा)",
            desc: "See pickup & drop clearly. Call passenger first.",
            img: "/images/guide/guide_new_ride.png"
        },
        {
            title: "3. Earnings (कमाई)",
            desc: "Track your daily cash and trips instantly.",
            img: "/images/guide/guide_earnings.png"
        }
    ]

    const currentSteps = activeTab === 'passenger' ? passengerSteps : driverSteps

    const nextStep = () => {
        if (step < currentSteps.length - 1) setStep(step + 1)
    }

    const prevStep = () => {
        if (step > 0) setStep(step - 1)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-wider">How to Use</h2>
                                <p className="text-xs text-slate-400 font-bold">Simple Guide (मदत)</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10 text-white">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-2 bg-slate-100 gap-2">
                            <button
                                onClick={() => { setActiveTab('passenger'); setStep(0); }}
                                className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${activeTab === 'passenger' ? 'bg-yellow-400 text-black shadow-md' : 'text-slate-500'}`}
                            >
                                <User className="h-4 w-4" /> Passenger
                            </button>
                            <button
                                onClick={() => { setActiveTab('driver'); setStep(0); }}
                                className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${activeTab === 'driver' ? 'bg-black text-white shadow-md' : 'text-slate-500'}`}
                            >
                                <Car className="h-4 w-4" /> Driver
                            </button>
                        </div>

                        {/* Content Carousel */}
                        <div className="flex-1 p-6 flex flex-col items-center">
                            <div className="relative w-full aspect-[9/16] bg-slate-200 rounded-3xl overflow-hidden mb-6 shadow-inner border-4 border-slate-100">
                                {/* IMAGE PLACEHOLDER - REPLACE SRC WITH REAL SCREENSHOTS */}
                                <img
                                    src={currentSteps[step].img}
                                    alt={currentSteps[step].title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-white/50 text-4xl font-black uppercase -rotate-45">Real Screenshot</span>
                                </div>
                            </div>

                            <div className="text-center space-y-2 mb-4">
                                <h3 className="text-xl font-black text-slate-900">{currentSteps[step].title}</h3>
                                <p className="text-sm font-medium text-slate-500 max-w-[80%] mx-auto leading-relaxed">
                                    {currentSteps[step].desc}
                                </p>
                            </div>

                            {/* Dots */}
                            <div className="flex gap-2 mb-6">
                                {currentSteps.map((_, i) => (
                                    <div key={i} className={`h-2 w-2 rounded-full transition-all ${i === step ? 'bg-slate-900 w-6' : 'bg-slate-300'}`} />
                                ))}
                            </div>

                            {/* Navigation */}
                            <div className="flex w-full gap-4">
                                <Button
                                    variant="outline"
                                    onClick={prevStep}
                                    disabled={step === 0}
                                    className="flex-1 h-12 rounded-xl font-bold border-2"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" /> Back
                                </Button>
                                <Button
                                    onClick={step === currentSteps.length - 1 ? onClose : nextStep}
                                    className={`flex-1 h-12 rounded-xl font-black text-black ${step === currentSteps.length - 1 ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-400 hover:bg-yellow-500'}`}
                                >
                                    {step === currentSteps.length - 1 ? "Finish" : "Next"} <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
