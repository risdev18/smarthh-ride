"use client"

// Updated: OTP + Google Login Flow
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/lib/store/useUserStore"
import SplashScreen from "@/components/screens/SplashScreen"
import OnboardingScreen from "@/components/screens/OnboardingScreen"
import OTPLoginScreen from "@/components/screens/OTPLoginScreen"

export default function HomePage() {
  const router = useRouter()
  const { user } = useUserStore()

  const [showSplash, setShowSplash] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  // Check if user has seen onboarding before
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (hasSeenOnboarding === 'true') {
      setShowOnboarding(false)
    }
  }, [])

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false)
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (hasSeenOnboarding === 'true') {
      setShowLogin(true)
    } else {
      setShowOnboarding(true)
    }
  }

  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setShowOnboarding(false)
    setShowLogin(true)
  }

  // Handle onboarding skip
  const handleOnboardingSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setShowOnboarding(false)
    setShowLogin(true)
  }

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'driver') {
        router.push("/driver/dashboard")
      } else if (user.role === 'admin') {
        router.push("/admin/drivers")
      } else {
        router.push("/passenger")
      }
    }
  }, [user, router])

  // Show appropriate screen
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    )
  }

  if (showLogin || !user) {
    return <OTPLoginScreen />
  }

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white text-xl">Redirecting...</div>
    </div>
  )
}
