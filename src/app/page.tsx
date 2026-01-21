"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Lock, ArrowRight, User, Phone, Car, ShieldCheck, UserCircle, Hexagon, Volume2, VolumeX, MapPin } from "lucide-react"
import { authService, UserRole } from "@/lib/services/authService"
import { useUserStore } from "@/lib/store/useUserStore"
import { motion, AnimatePresence } from "framer-motion"

export default function UnifiedAuth() {
  const router = useRouter()
  const { user, setUser } = useUserStore()

  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<UserRole>('passenger')

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    vehicleNumber: ""
  })

  const [soundEnabled, setSoundEnabled] = useState(false)

  // If already logged in, redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'driver') router.push("/driver/dashboard");
      else if (user.role === 'admin') router.push("/admin");
      else router.push("/passenger");
    }
  }, [user, router])

  const handleAuth = async () => {
    const identifier = formData.phone

    // Validation: 10 digits for phone-based roles, any length for Admin ID
    const isPhoneRole = role === 'passenger' || role === 'driver'
    if (isPhoneRole && identifier.length !== 10) return
    if (role === 'admin' && !identifier) return
    if (!formData.password) return
    if (!isLogin && !formData.name) return

    setLoading(true)
    try {
      if (isLogin) {
        // --- MASTER ADMIN BYPASS (Supports both variations) ---
        const isAdminMatch = role === 'admin' && (identifier === 'RishabhAnsh@1212' || identifier === 'Rishabh@Ansh1212')
        if (isAdminMatch && formData.password === '4137') {
          console.log("Master Admin access granted.");
          setUser({
            id: 'admin_master',
            name: 'Rishabh Admin',
            phone: identifier,
            role: 'admin',
            isApproved: true
          });
          setLoading(false);
          return;
        }

        const loginId = role === 'admin' ? identifier : "+91 " + identifier
        const u = await authService.login(loginId, formData.password)
        if (u) {
          setUser({
            id: u.id || "",
            name: u.name,
            phone: u.phone,
            role: u.role,
            vehicleNumber: u.vehicleNumber,
            isApproved: u.isApproved,
            verificationStatus: u.verificationStatus
          })
        } else {
          alert(`Invalid credentials for ${role}. Please check your details.`)
        }
      } else {
        await authService.register({
          name: formData.name,
          phone: "+91 " + formData.phone,
          password: formData.password,
          role: role,
          vehicleNumber: role === 'driver' ? formData.vehicleNumber : undefined
        })
        alert("Account Created! You can now login.")
        setIsLogin(true)
      }
    } catch (e: any) {
      console.error(e)
      alert(e.message || "Auth Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-4 lg:p-8 relative overflow-hidden font-sans">

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Sound Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="h-10 w-10 glass rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors border border-white/5"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-[420px] space-y-8"
      >
        {/* Branding Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-charcoal/50 backdrop-blur-md border border-white/5 px-4 py-1.5 rounded-full"
          >
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(245,200,66,0.6)]"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Premium Mobility</span>
          </motion.div>

          <div className="relative inline-block mt-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter flex flex-col items-center leading-tight">
              <span className="text-white">Aapla Shehar,</span>
              <span className="text-primary italic -mt-1">Aapli Auto 🚖</span>
            </h1>
            <div className="mt-4 flex flex-col items-center gap-2">
              <p className="text-primary font-black text-sm uppercase tracking-[0.3em] italic">Vishwasacha Pravas</p>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full border border-white/5">
                <span>Safe</span>
                <span className="h-1 w-1 bg-white/20 rounded-full"></span>
                <span>Local</span>
                <span className="h-1 w-1 bg-white/20 rounded-full"></span>
                <span>Affordable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Container */}
        <div className="bg-surface/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-premium overflow-hidden p-1.5 relative group">

          {/* Subtle Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          {/* Role Selection Tabs */}
          <div className="bg-background/80 p-1.5 flex rounded-[2.5rem] border border-white/5 shadow-inner">
            {[
              { id: 'passenger', label: 'Passenger', icon: UserCircle },
              { id: 'driver', label: 'Driver', icon: Car },
              { id: 'admin', label: 'Admin', icon: ShieldCheck }
            ].map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setRole(tab.id as UserRole)}
                className={`flex-1 relative flex items-center justify-center gap-2 py-3.5 rounded-[2rem] transition-all duration-500 z-10 ${role === tab.id ? 'text-background font-black' : 'text-muted-foreground hover:text-white'}`}
              >
                {role === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-[2rem] -z-10 shadow-lg shadow-primary/20"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.8 }}
                  />
                )}
                <tab.icon className={`h-4 w-4 ${role === tab.id ? 'text-background stroke-[2.5px]' : 'text-muted-foreground'}`} />
                <span className="text-[10px] uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-8 pt-10 space-y-8">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight">{isLogin ? "Welcome" : "Create Account"}</h2>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
                  {isLogin ? `Log in as ${role}` : "Register on the network"}
                </p>
              </div>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors py-2 px-1"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="space-y-4"
                  >
                    <div className="group space-y-2">
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <Input
                          placeholder="Full Name"
                          className="h-16 bg-background/50 border-white/5 rounded-2xl pl-14 font-bold focus:border-primary/50 focus:bg-background transition-all border-2 text-base"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>

                    {role === 'driver' && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group space-y-2"
                      >
                        <div className="relative">
                          <Car className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary" />
                          <Input
                            placeholder="Vehicle Number"
                            className="h-16 bg-background/50 border-white/5 rounded-2xl pl-14 font-bold focus:border-primary/50 focus:bg-background transition-all border-2 uppercase text-base"
                            value={formData.vehicleNumber}
                            onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="group space-y-2">
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground group-focus-within:text-primary" />
                    {role !== 'admin' && <span className="text-muted-foreground font-black text-sm tracking-tighter opacity-50">+91</span>}
                  </div>
                  <Input
                    placeholder={role === 'admin' ? "Admin ID" : "Phone Number"}
                    maxLength={role === 'admin' ? 30 : 10}
                    className={`h-16 bg-background/50 border-white/5 rounded-2xl font-bold focus:border-primary/50 focus:bg-background transition-all border-2 text-lg ${role !== 'admin' ? 'pl-[4.5rem] tracking-[0.15em]' : 'pl-14'}`}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: role === 'admin' ? e.target.value : e.target.value.replace(/\D/g, '') })}
                  />
                </div>
              </div>

              <div className="group space-y-2">
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="h-16 bg-background/50 border-white/5 rounded-2xl pl-14 font-bold focus:border-primary/50 focus:bg-background transition-all border-2 text-base"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Button
              variant="premium"
              className="w-full h-18 text-xl font-black rounded-3xl shadow-glow group hover:-translate-y-1 active:scale-[0.97] hover:brightness-105 transition-all mt-2 relative overflow-hidden"
              onClick={handleAuth}
              disabled={loading || !formData.phone || !formData.password}
            >
              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : (
                <div className="flex items-center gap-3">
                  <span>
                    {isLogin
                      ? (role === 'passenger' ? "BOOK A RIDE" : role === 'driver' ? "DRIVE & EARN" : "MANAGE SYSTEM")
                      : `JOIN AS ${role.toUpperCase()}`
                    }
                  </span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="h-6 w-6" />
                  </motion.div>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-3 gap-2 px-2">
          {[
            { icon: ShieldCheck, label: "No Commission" },
            { icon: Lock, label: "Verified Drivers" },
            { icon: MapPin, label: "Local Area" }
          ].map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (i * 0.1) }}
              className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl bg-white/5 border border-white/5"
            >
              <point.icon className="h-4 w-4 text-primary" />
              <span className="text-[8px] font-black uppercase tracking-tight text-muted-foreground leading-tight">
                {point.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footer info & Links */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <button className="hover:text-primary transition-colors">Support</button>
            <button className="hover:text-primary transition-colors">Contact</button>
            <button className="hover:text-primary transition-colors">Privacy Policy</button>
          </div>
          <p className="text-center text-muted-foreground text-[8px] font-black uppercase tracking-[0.2em] opacity-40">
            Encrypted Session · Smarth OS v2.0
          </p>
        </div>
      </motion.div>

      {/* Animated Rickshaw Visual */}
      <div className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none pb-20 h-40">
        {/* Simple Road Line */}
        <div className="absolute bottom-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 1 }}
          className="absolute bottom-10 left-[10%]"
        >
          <motion.div
            animate={{
              y: [0, -3, 0],
              rotate: [0, -1, 0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              {/* Headlight Glow */}
              <div className="absolute -right-4 top-2 h-8 w-16 bg-primary/20 blur-xl rounded-full" />
              <Car className="h-12 w-12 text-primary drop-shadow-[0_0_15px_rgba(245,200,66,0.3)]" />
            </div>

            {/* Motion Lines */}
            <div className="mt-1 flex gap-1">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ x: [-10, 10], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "linear"
                  }}
                  className="h-[1px] w-4 bg-white/20"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  )
}

