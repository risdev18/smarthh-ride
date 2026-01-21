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

  const [showAuth, setShowAuth] = useState(false)

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
    const isPhoneRole = role === 'passenger' || role === 'driver'
    if (isPhoneRole && identifier.length !== 10) return
    if (role === 'admin' && !identifier) return
    if (!formData.password) return
    if (!isLogin && !formData.name) return

    setLoading(true)
    try {
      if (isLogin) {
        // --- MASTER ADMIN BYPASS ---
        const isAdminMatch = role === 'admin' && (identifier === 'RishabhAnsh@1212' || identifier === 'Rishabh@Ansh1212')
        if (isAdminMatch && formData.password === '4137') {
          setUser({ id: 'admin_master', name: 'Rishabh Admin', phone: identifier, role: 'admin', isApproved: true });
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

  const roleOptions = [
    { id: 'passenger', label: 'Passenger', icon: UserCircle, desc: 'Book a ride in seconds' },
    { id: 'driver', label: 'Driver', icon: Car, desc: 'Drive and start earning' },
    { id: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'Manage system operations' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary/30">
      {/* Background Hero Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 scale-105"
          style={{ backgroundImage: 'url("/hero-bg.png")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-slate-950/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Car className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-xl font-black tracking-tighter">SMARTH<span className="text-primary italic">RIDES</span></span>
        </div>
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="h-10 w-10 glass rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors border border-white/5"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </motion.button>
          <Button variant="outline" className="hidden md:flex border-white/10 hover:bg-white/5 rounded-full text-xs font-bold uppercase tracking-widest">Support</Button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 pt-24">

        {/* HERO SECTION / ROLE SELECTION */}
        <AnimatePresence mode="wait">
          {!showAuth ? (
            <motion.section
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="px-6 py-12 flex flex-col items-center justify-center min-h-[80vh] max-w-6xl mx-auto"
            >
              <div className="text-center space-y-6 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 bg-charcoal/50 backdrop-blur-md border border-white/5 px-4 py-1.5 rounded-full"
                >
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(245,200,66,0.6)]"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Vishwasacha Pravas</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                  Reliable Local Rides<br />
                  <span className="text-primary italic">— Faster, Safer, Smarter</span>
                </h1>
                <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium">
                  Experience seamless commuting in your city. Get around town with easy booking,
                  trusted local drivers, and zero hidden costs.
                </p>
              </div>

              {/* Roles Flow Step 1: Big Icons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {roleOptions.map((opt, i) => (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + (i * 0.1) }}
                    onClick={() => {
                      setRole(opt.id as UserRole);
                      setShowAuth(true);
                    }}
                    className="group relative bg-surface/40 hover:bg-surface/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] transition-all duration-500 text-center flex flex-col items-center gap-4 hover:border-primary/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
                  >
                    <div className="h-16 w-16 bg-slate-900 rounded-3xl flex items-center justify-center group-hover:bg-primary transition-colors border border-white/5">
                      <opt.icon className="h-8 w-8 text-primary group-hover:text-slate-950 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{opt.label}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{opt.desc}</p>
                    </div>
                    <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Trust Badges Bar */}
              <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
                {[
                  { icon: ShieldCheck, label: "Verified Drivers" },
                  { icon: Lock, label: "Secure Login" },
                  { icon: Phone, label: "Local Support" }
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <badge.icon className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{badge.label}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          ) : (
            /* STEP 2: AUTH FORM */
            <motion.section
              key="auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="px-6 py-12 min-h-[80vh] flex flex-col items-center justify-center relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-4">
                <button
                  onClick={() => setShowAuth(false)}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Back to Selection
                </button>
              </div>

              <div className="z-10 w-full max-w-[420px] space-y-8">
                {/* Auth Container */}
                <div className="bg-surface/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-premium overflow-hidden p-1.5 relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none transition-opacity duration-700"></div>

                  <div className="p-8 pt-10 space-y-8">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                            {role === 'passenger' ? <UserCircle className="h-3 w-3 text-primary" /> : <Car className="h-3 w-3 text-primary" />}
                          </div>
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">{role} HUB</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">{isLogin ? "Welcome" : "Create Account"}</h2>
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
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* HOW IT WORKS SECTION */}
        <section className="px-6 py-24 bg-slate-900/30 backdrop-blur-3xl border-y border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Simple Process</span>
              <h2 className="text-4xl font-black">How It Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: "01", title: "Open the App", desc: "Access the hub from any device smoothly." },
                { step: "02", title: "Select Your Ride", desc: "Choose your destination and preferred vehicle." },
                { step: "03", title: "Pay & Go", desc: "Transparent pricing and quick arrivals." }
              ].map((step, i) => (
                <div key={i} className="relative p-8 rounded-[2.5rem] bg-slate-950/50 border border-white/5 hover:border-primary/20 transition-all group">
                  <span className="text-5xl font-black text-white/5 absolute top-6 right-8 group-hover:text-primary/10 transition-colors">{step.step}</span>
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL SECTION */}
        <section className="px-6 py-24 max-w-4xl mx-auto overflow-hidden">
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            className="bg-primary p-12 rounded-[3.5rem] text-slate-950 text-center relative group"
          >
            <div className="absolute top-8 left-12 opacity-20 italic font-serif text-9xl leading-none">“</div>
            <p className="text-2xl md:text-3xl font-black tracking-tight leading-tight relative z-10">
              “Saved me time and money! Best way to travel locally without any hassle.”
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 pt-6 border-t border-slate-950/10">
              <div className="h-10 w-10 rounded-full bg-slate-950/10 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <span className="font-black uppercase tracking-widest text-[10px]">Local Riders Social Proof</span>
            </div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 py-16 border-t border-white/5 bg-slate-950">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                  <Car className="h-3.5 w-3.5 text-slate-950" />
                </div>
                <span className="text-sm font-black tracking-tighter">SMARTH<span className="text-primary italic">RIDES</span></span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed max-w-sm">
                Building the future of local urban mobility. Connecting passengers with trusted drivers
                for a safer, more affordable journey every time.
              </p>
              <div className="flex gap-4">
                {['twitter', 'facebook', 'instagram'].map(s => (
                  <div key={s} className="h-8 w-8 rounded-full border border-white/5 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Company</h4>
              <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Support</h4>
              <ul className="space-y-3 text-xs font-bold text-muted-foreground">
                <li className="flex items-center gap-2 italic"><span className="text-white">Email:</span> support@samarthride.com</li>
                <li className="flex items-center gap-2 italic"><span className="text-white">Phone:</span> +91 99999 00000</li>
                <li className="hover:text-white cursor-pointer transition-colors pt-2">Help Center</li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground">
            <p className="text-[8px] font-black uppercase tracking-[0.2em]">© 2026 Smarth Rides Inc. All rights reserved.</p>
            <p className="text-[8px] font-black uppercase tracking-[0.2em]">Encrypted Session · Smarth OS v2.0</p>
          </div>
        </footer>
      </main>

      {/* FIXED RICKSHAW VISUAL (Subtle) */}
      {!showAuth && (
        <div className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none pb-20 h-40 z-20">
          <div className="absolute bottom-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 1 }}
            className="absolute bottom-10 left-[10%]"
          >
            <motion.div
              animate={{ y: [0, -3, 0], rotate: [0, -1, 0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <div className="absolute -right-4 top-2 h-8 w-16 bg-primary/20 blur-xl rounded-full" />
                <Car className="h-12 w-12 text-primary drop-shadow-[0_0_15px_rgba(245,200,66,0.3)]" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

