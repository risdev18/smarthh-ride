"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Truck, Loader2 } from "lucide-react"
import { auth } from "@/lib/firebase" // Ensure this exports your initialized auth instance
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth"

export default function DriverLogin() {
    const router = useRouter()
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

    useEffect(() => {
        // Initialize Recaptcha
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                },
                'expired-callback': () => {
                    // Reset reCAPTCHA?
                }
            });
        }
    }, [])

    const handleSendOTP = async () => {
        // 1. Demo Backdoor
        if (phone === "9999999999") {
            router.push("/driver/dashboard")
            return
        }

        if (phone.length !== 10) return

        setLoading(true)
        const phoneNumber = "+91" + phone
        const appVerifier = window.recaptchaVerifier

        try {
            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            setConfirmationResult(result)
            setOtpSent(true)
        } catch (error) {
            console.error("Error sending OTP:", error)
            alert("Failed to send OTP. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async () => {
        if (!confirmationResult || otp.length !== 6) return
        setLoading(true)
        try {
            await confirmationResult.confirm(otp)
            // User signed in successfully.
            // Check if user exists in DB? For now, assume flow:
            // If new user -> Register
            // If existing -> Dashboard
            // For simplicity in this demo flow, we default to Register/Dashboard logic handled by next page or check

            // For now, let's route to register to ensure we capture details, 
            // or dashboard if we had a check. 
            // Let's assume successful login goes to Register (which can check/skip) or Dashboard.
            // Based on previous flow:
            router.push("/driver/register")
        } catch (error) {
            console.error("Error verifying OTP:", error)
            alert("Invalid OTP.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-screen p-6 justify-between bg-black text-white selection:bg-primary selection:text-black">
            <div id="recaptcha-container"></div> {/* Invisible Recaptcha */}

            <div className="space-y-6 mt-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-zinc-900 rounded-full border border-zinc-800 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                        <Truck className="h-16 w-16 text-green-500" />
                    </div>
                    <h1 className="text-4xl font-black text-center tracking-tighter">
                        SMARTH <span className="text-green-500">PARTNER</span>
                    </h1>
                </div>
                {!otpSent ? (
                    <div className="text-center text-lg font-bold text-zinc-400">
                        Kamaiye Samman Se <br /> <span className="text-white">(Earn with Pride)</span>
                    </div>
                ) : (
                    <div className="text-center text-lg font-bold text-zinc-400">
                        Enter the OTP sent to <br /> <span className="text-white">+91 {phone}</span>
                    </div>
                )}
            </div>

            <div className="space-y-6 bg-zinc-900 p-6 rounded-3xl text-white border border-zinc-800 shadow-2xl">
                {!otpSent ? (
                    <>
                        <div className="space-y-2">
                            <label className="text-xs font-bold ml-1 text-zinc-500 uppercase tracking-wider">Mobile Number</label>
                            <div className="flex gap-3">
                                <div className="h-14 w-16 flex items-center justify-center bg-black rounded-xl font-bold text-lg border border-zinc-700 text-zinc-400">
                                    +91
                                </div>
                                <Input
                                    type="tel"
                                    placeholder="98765 43210"
                                    className="flex-1 h-14 bg-black border-zinc-700 text-xl font-bold tracking-widest text-white placeholder:text-zinc-700 focus-visible:ring-green-500 rounded-xl"
                                    maxLength={10}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 text-xl font-black bg-green-500 text-black hover:bg-green-400 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all active:scale-[0.98]"
                            size="lg"
                            onClick={handleSendOTP}
                            disabled={phone.length !== 10 || loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "SEND OTP"}
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="space-y-2">
                            <label className="text-xs font-bold ml-1 text-zinc-500 uppercase tracking-wider">One Time Password</label>
                            <Input
                                type="text"
                                placeholder="• • • • • •"
                                className="h-14 bg-black border-zinc-700 text-3xl font-black text-center tracking-[1rem] text-white placeholder:text-zinc-800 focus-visible:ring-green-500 rounded-xl"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>

                        <Button
                            className="w-full h-14 text-xl font-black bg-white text-black hover:bg-zinc-200 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-[0.98]"
                            size="lg"
                            onClick={handleVerifyOTP}
                            disabled={otp.length !== 6 || loading}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "VERIFY & LOGIN"}
                        </Button>

                        <button
                            onClick={() => setOtpSent(false)}
                            className="w-full text-zinc-500 text-sm font-bold hover:text-white"
                        >
                            Change Mobile Number
                        </button>
                    </>
                )}
                <div className="pt-4 border-t border-zinc-800 flex justify-center">
                    <button
                        onClick={() => router.push("/")}
                        className="text-green-500 font-black uppercase tracking-widest text-[10px] py-2 px-6 bg-zinc-950 border border-zinc-800 rounded-full shadow-lg hover:bg-zinc-800 transition-all"
                    >
                        Switch to Passenger / Admin
                    </button>
                </div>
            </div>
        </div>
    )
}
// Add type def for window
declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}
