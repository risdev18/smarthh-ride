"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Phone, CarFront, HelpCircle, MapPin, AlertCircle, RefreshCw, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import AppGuide from "@/components/guide/AppGuide"

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isAction?: boolean; // If true, shows buttons
}

export default function SmartAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [showGuide, setShowGuide] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "नमस्कार 🙏\nमी समर्थ राईड हेल्पलाईन.\n\nतुम्हाला काय मदत हवी आहे?",
            sender: 'bot',
            timestamp: new Date(),
            isAction: true
        }
    ])

    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    // --- RULE-BASED LOGIC ---
    const handleAction = (action: string) => {
        if (action === "📚 How to Use App?") {
            setShowGuide(true);
            return;
        }

        // 1. Add User Selection to Chat
        const userMsg: Message = {
            id: Date.now().toString(),
            text: action,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);

        // 2. Bot Response Logic (Timeout for natural feel)
        setTimeout(() => {
            let botText = "";
            let showOptions = false;

            switch (action) {
                case "🚖 Book Auto (रिक्षा बुक करा)":
                    botText = "रिक्षा बुक करण्यासाठी:\n\n1. Passenger Tab वर जा.\n2. 'Where to?' मध्ये ठिकाण टाका.\n3. 'Call Driver' किंवा 'Confirm' करा.\n\nमी तुम्हाला तिकडे नेऊ का?";
                    break;
                case "💰 Return Ride Charges?":
                    botText = "🔁 **Return Ride (परत येणे)**\n\nगावातून शहरात जाताना ड्रायव्हरला रिकामं परत यावं लागतं, म्हणून 'One Way' आणि 'Return' चे दर वेगळे असतात.\n\nरिटर्न राईड स्वस्त पडते! ✅";
                    break;
                case "📞 Call Driver / Support":
                    botText = "तुम्हाला कोणाशी बोलायचे आहे?";
                    showOptions = true; // Sub-menu
                    break;
                case "❌ Problem / Help":
                    botText = "काय अडचण आहे?\n(What is the problem?)";
                    break;
                case "Late Driver":
                    botText = "माफ करा 🙏\nकधी कधी ट्रॅफिकमुळे उशीर होतो.\n\nकृपया ड्रायव्हरला थेट कॉल करा.";
                    break;
                case "Emergency 🚨":
                    botText = "🚨 **Emergency Help**\n\nस्थानिक पोलीस: 100\nसमर्थ हेल्पलाइन: +91 8468943268\n\nतुमचे लोकेशन शेअर करा.";
                    break;
                default:
                    botText = "ठीक आहे. आणखी काही मदत हवी असल्यास सांगा. 🙏";
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: botText,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);

        }, 600);
    }

    return (
        <>
            <AppGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />

            {/* FLOATING ACTION BUTTON */}
            <motion.div
                className="fixed bottom-6 right-6 z-[1000]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-16 w-16 rounded-full bg-yellow-400 text-black shadow-2xl shadow-yellow-500/40 flex items-center justify-center p-0 border-4 border-black"
                >
                    {isOpen ? <X className="h-8 w-8" /> : <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Helper" className="h-10 w-10 rounded-full" />}
                </Button>
            </motion.div>

            {/* CHAT WINDOW */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-24 right-6 w-[90vw] max-w-[360px] h-[550px] bg-white border-2 border-slate-900 rounded-[2rem] shadow-2xl z-[1000] flex flex-col overflow-hidden font-sans"
                    >
                        {/* Header: "Local Auto Stand Helper" */}
                        <div className="bg-yellow-400 p-4 flex items-center gap-3 border-b-2 border-slate-900">
                            <div className="h-10 w-10 bg-white border-2 border-black rounded-full overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Helper" />
                            </div>
                            <div>
                                <h3 className="text-black font-black text-lg leading-none">समर्थ हेल्पलाइन</h3>
                                <p className="text-slate-700 text-xs font-bold mt-1">आपला मित्र (Helper) 🤝</p>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scroll-smooth"
                        >
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    {/* Message Bubble */}
                                    <div className={`p-4 rounded-2xl max-w-[85%] text-sm font-bold whitespace-pre-wrap shadow-sm ${msg.sender === 'user'
                                            ? 'bg-slate-900 text-white rounded-tr-none'
                                            : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>

                                    {/* Timestamp */}
                                    <span className="text-[10px] text-slate-400 font-bold mt-1 px-1">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* BIG ACTION BUTTONS (No Typing needed mostly) */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest text-center">👇 Tap to Select (निवडा)</p>

                            {/* NEW: App Guide Button Top */}
                            <Button
                                variant="default"
                                className="w-full mb-3 bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 h-12 rounded-xl"
                                onClick={() => handleAction("📚 How to Use App?")}
                            >
                                <BookOpen className="h-5 w-5 text-yellow-400" />
                                <span className="font-bold">App Guide (ॲप कसे वापरावे?)</span>
                            </Button>

                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 hover:bg-yellow-50 hover:border-yellow-400" onClick={() => handleAction("🚖 Book Auto (रिक्षा बुक करा)")}>
                                    <CarFront className="h-5 w-5 text-slate-900" />
                                    <span className="text-xs font-bold">Book Auto</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 hover:bg-yellow-50 hover:border-yellow-400" onClick={() => handleAction("💰 Return Ride Charges?")}>
                                    <RefreshCw className="h-5 w-5 text-green-600" />
                                    <span className="text-xs font-bold">Return Charges</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 hover:bg-yellow-50 hover:border-yellow-400" onClick={() => handleAction("📞 Call Driver / Support")}>
                                    <Phone className="h-5 w-5 text-blue-600" />
                                    <span className="text-xs font-bold">Call Support</span>
                                </Button>
                                <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 hover:bg-red-50 hover:border-red-400" onClick={() => handleAction("Emergency 🚨")}>
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                    <span className="text-xs font-bold">Emergency</span>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
