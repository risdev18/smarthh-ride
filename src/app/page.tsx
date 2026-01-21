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
    { id: 'passenger', title: 'I am a Passenger', label: 'Book a Ride', icon: UserCircle, desc: 'Reliable rides at low fares' },
    { id: 'driver', title: 'I am a Driver', label: 'Drive & Earn', icon: Car, desc: 'Zero commission, high earnings' },
    { id: 'admin', title: 'I am an Admin', label: 'Manage HUB', icon: ShieldCheck, desc: 'Control system operations' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary/30 scroll-smooth">
      {/* Background Hero Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.15] scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=2070")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-primary/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[160px]"></div>
      </div>

      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-slate-950/70 backdrop-blur-xl border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 group cursor-pointer"
          onClick={() => setShowAuth(false)}
        >
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Car className="h-6 w-6 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter leading-none">SMARTH<span className="text-primary italic">RIDES</span></span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/60">Aapla Shehar, Aapli Auto</span>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary transition-colors border border-white/10"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </motion.button>
          <Button
            onClick={() => setShowAuth(true)}
            className="bg-primary text-slate-950 font-black text-xs uppercase tracking-widest px-6 rounded-full hover:shadow-glow hover:scale-105 transition-all"
          >
            Login
          </Button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10">

        {/* HERO SECTION */}
        <AnimatePresence mode="wait">
          {!showAuth ? (
            <motion.section
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center"
            >
              <div className="text-center space-y-8 mb-24">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2 rounded-full shadow-2xl"
                >
                  <span className="text-[12px] font-black uppercase tracking-[0.3em] text-primary italic">The Future of India's Local Travel</span>
                </motion.div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.95] max-w-5xl mx-auto">
                  Reliable Local Rides<br />
                  <span className="text-primary italic">— Faster, Safer, Smarter</span>
                </h1>

                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                  Connecting your city's trusted auto-rickshaw network with zero middleman fees.
                  <span className="text-white block mt-2 italic font-black">Low Fares for Passengers. High Earnings for Drivers.</span>
                </p>

                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={() => { setRole('passenger'); setShowAuth(true); }}
                    className="h-16 px-10 rounded-2xl bg-white text-slate-950 font-black text-lg gap-3 hover:bg-primary transition-all shadow-xl"
                  >
                    Book a Ride <ArrowRight className="h-6 w-6" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => { setRole('driver'); setShowAuth(true); }}
                    className="h-16 px-10 rounded-2xl border-white/20 hover:bg-white/5 font-black text-lg"
                  >
                    Drive & Earn
                  </Button>
                </div>
              </div>

              {/* Roles Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                {roleOptions.map((opt, i) => (
                  <motion.div
                    key={opt.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="group bg-surface/30 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 flex flex-col items-center text-center gap-6"
                  >
                    <div className="h-20 w-20 bg-slate-950 rounded-[2rem] flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all border border-white/10 group-hover:shadow-glow">
                      <opt.icon className="h-10 w-10 text-primary group-hover:text-slate-950 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black leading-tight uppercase tracking-tight">{opt.title}</h3>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed">{opt.desc}</p>
                    </div>
                    <Button
                      onClick={() => { setRole(opt.id as UserRole); setShowAuth(true); }}
                      variant="link"
                      className="text-primary font-black uppercase text-xs tracking-widest gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {opt.label} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
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
              className="px-6 min-h-screen flex flex-col items-center justify-center relative bg-slate-950/60 backdrop-blur-3xl"
            >
              <div className="absolute top-28 left-1/2 -translate-x-1/2">
                <button
                  onClick={() => setShowAuth(false)}
                  className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all hover:gap-5"
                >
                  <ArrowRight className="h-5 w-5 rotate-180" />
                  Back to Selection
                </button>
              </div>

              <div className="z-10 w-full max-w-[440px] mt-10">
                <div className="bg-surface border border-white/10 rounded-[3.5rem] shadow-2xl p-2 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>

                  <div className="p-10 space-y-8">
                    <div className="space-y-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-1.5 rounded-full">
                        <Car className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">{role} Network Access</span>
                      </div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase">{isLogin ? "Welcome Back" : "Join Hub"}</h2>
                      <div className="flex justify-center gap-2">
                        <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                          {isLogin ? "New to Smarth Rides?" : "Already have an account?"}
                        </span>
                        <button
                          onClick={() => setIsLogin(!isLogin)}
                          className="text-xs font-black text-primary hover:underline uppercase tracking-widest"
                        >
                          {isLogin ? "Sign Up" : "Log In"}
                        </button>
                      </div>
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
                            <div className="relative group/input">
                              <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                              <Input
                                placeholder="Full Name"
                                className="h-18 bg-slate-900 border-white/5 rounded-2xl pl-16 font-bold focus:border-primary/50 transition-all border-2 text-base"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              />
                            </div>

                            {role === 'driver' && (
                              <div className="relative group/input">
                                <Car className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                                <Input
                                  placeholder="Vehicle Number"
                                  className="h-18 bg-slate-900 border-white/5 rounded-2xl pl-16 font-bold focus:border-primary/50 transition-all border-2 uppercase text-base"
                                  value={formData.vehicleNumber}
                                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                                />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="relative group/input">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <Phone className="h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                          {role !== 'admin' && <span className="text-muted-foreground font-black text-sm tracking-tighter opacity-50">+91</span>}
                        </div>
                        <Input
                          placeholder={role === 'admin' ? "Admin Access ID" : "Phone Number"}
                          maxLength={role === 'admin' ? 30 : 10}
                          className={`h-18 bg-slate-900 border-white/5 rounded-2xl font-bold focus:border-primary/50 transition-all border-2 text-lg ${role !== 'admin' ? 'pl-[4.8rem] tracking-[0.15em]' : 'pl-16'}`}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: role === 'admin' ? e.target.value : e.target.value.replace(/\D/g, '') })}
                        />
                      </div>

                      <div className="relative group/input">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                        <Input
                          type="password"
                          placeholder="Vault Password"
                          className="h-18 bg-slate-900 border-white/5 rounded-2xl pl-16 font-bold focus:border-primary/50 transition-all border-2 text-base"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button
                      variant="premium"
                      className="w-full h-20 text-xl font-black rounded-3xl shadow-glow active:scale-[0.97] hover:translate-y-[-4px] transition-all relative overflow-hidden group shadow-primary/20"
                      onClick={handleAuth}
                      disabled={loading || !formData.phone || !formData.password}
                    >
                      {loading ? <Loader2 className="animate-spin h-8 w-8" /> : (
                        <div className="flex items-center gap-4">
                          <span>
                            {isLogin
                              ? (role === 'passenger' ? "BOOK NOW" : role === 'driver' ? "START EARNING" : "ACCESS CONSOLE")
                              : `JOIN NETWORK`
                            }
                          </span>
                          <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* TRUST & BENEFITS GRID */}
        <section className="px-6 py-32 bg-slate-900/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-20 space-y-4">
              <span className="text-primary font-black uppercase tracking-[0.4em] text-xs underline underline-offset-8">Why Smarth Rides?</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight uppercase">Built for trust & efficiency</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: ShieldCheck, title: "Verified Drivers", desc: "Every driver undergoes strict background verification and manual approval." },
                { icon: MapPin, title: "Live Tracking", desc: "Share your live location with family. Safety is our number one priority." },
                { icon: Lock, title: "Secure Payments", desc: "End-to-end encrypted transactions directly between you and the driver." },
                { icon: Gauge, title: "Zero Hidden Fares", desc: "See exactly what you'll pay before you book. No surprises, no bargaining." }
              ].map((benefit, i) => (
                <div key={i} className="bg-slate-950 p-10 rounded-[3rem] border border-white/5 hover:border-primary/30 transition-all group">
                  <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                    <benefit.icon className="h-7 w-7 text-primary group-hover:text-slate-950 transition-colors" />
                  </div>
                  <h3 className="text-xl font-black mb-3 italic">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* APP SHOWCASE SECTION */}
        <section className="px-6 py-32 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full group-hover:bg-primary/30 transition-all"></div>
              <div className="relative rounded-[4rem] border-8 border-slate-900 overflow-hidden shadow-2xl bg-slate-900">
                {/* Simulated Phone UI */}
                <div className="h-[600px] w-full bg-slate-950 flex flex-col">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Tracking</span>
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
                  </div>
                  <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-50 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="h-12 w-12 bg-primary rounded-full flex items-center justify-center shadow-glow"
                    >
                      <Car className="h-6 w-6 text-slate-950" />
                    </motion.div>
                  </div>
                  <div className="p-8 bg-slate-900 space-y-4">
                    <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                    <div className="h-12 w-full bg-primary rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase">
                Experience Local<br />
                <span className="text-primary italic">Mobility 2.0</span>
              </h2>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                Say goodbye to the uncertainty of finding an auto-rickshaw. Our platform directly
                connects you to the most reliable local drivers with high-tech live tracking
                and transparent pricing. It's the ride-sharing you know, but optimized for
                your local city.
              </p>
              <ul className="space-y-4">
                {[
                  "Instant Booking in < 1 minute",
                  "Emergency SOS button for safety",
                  "Driver rating & review system",
                  "Fixed, fair travel rates"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 py-32 bg-slate-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-24 space-y-4">
              <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">The Flow</span>
              <h2 className="text-5xl font-black uppercase">3 Steps to start</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {[
                { step: "01", title: "Verify Your Identity", desc: "Login securely with your phone number and OTP access." },
                { step: "02", title: "Confirm Destination", desc: "Select where you want to go and choose the best vehicle option." },
                { step: "03", title: "Enjoy the Journey", desc: "Step in, track your ride live, and pay easily on arrival." }
              ].map((step, i) => (
                <div key={i} className="relative group text-center flex flex-col items-center">
                  <span className="text-8xl font-black text-white/5 absolute -top-12 leading-none group-hover:text-primary/10 transition-all">{step.step}</span>
                  <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 relative z-10 border border-white/5">
                    {i === 0 ? <Lock className="h-8 w-8 text-primary" /> : i === 1 ? <MapPin className="h-8 w-8 text-primary" /> : <ShieldCheck className="h-8 w-8 text-primary" />}
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tight">{step.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 py-24 bg-slate-950 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[160px] pointer-events-none"></div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 relative z-10">
            <div className="md:col-span-2 space-y-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
                  <Car className="h-6 w-6 text-slate-950" />
                </div>
                <span className="text-2xl font-black tracking-tighter">SMARTH<span className="text-primary italic">RIDES</span></span>
              </div>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-md">
                The ultimate ride-sharing bridge for local cities. We empower local drivers
                and reward regular passengers with a smarter way to travel.
              </p>
              <div className="flex gap-6">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary transition-all cursor-pointer group">
                    <ShieldCheck className="h-5 w-5 text-muted-foreground group-hover:text-slate-950" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary underline underline-offset-8">Quick Navigation</h4>
              <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-muted-foreground">
                <li className="hover:text-primary cursor-pointer transition-colors">Our Mission</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Safety Protocols</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Partner with us</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Career Hub</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary underline underline-offset-8">Direct Contact</h4>
              <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-muted-foreground">
                <li className="flex flex-col"><span className="text-[8px] opacity-40">Email Hub</span> support@smarthride.com</li>
                <li className="flex flex-col"><span className="text-[8px] opacity-40">Hotline</span> +91 999 000 1212</li>
                <li className="pt-4"><Button variant="outline" className="w-full border-primary/20 hover:bg-primary/10 font-black tracking-widest text-[10px]">SOS Support</Button></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground">
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Smarth Rides Inc. All rights reserved.</p>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Encrypted Session · Smarth OS v2.0</p>
          </div>
        </footer>
      </main>

      {/* RICKSHAW OVERLAY (Only on Hero Selection) */}
      {!showAuth && (
        <div className="fixed bottom-0 left-0 w-full overflow-hidden pointer-events-none pb-20 h-40 z-20">
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 1 }}
            className="absolute bottom-10 left-[5%]"
          >
            <motion.div
              animate={{ y: [0, -3, 0], rotate: [0, -1, 0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <div className="absolute -right-6 top-2 h-10 w-20 bg-primary/30 blur-2xl rounded-full" />
                <Car className="h-14 w-14 text-primary drop-shadow-[0_0_20px_rgba(245,200,66,0.4)]" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function Gauge(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  )
}
