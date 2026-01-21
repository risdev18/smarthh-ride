import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
    id: string
    name: string
    phone: string
    role: 'passenger' | 'driver' | 'admin'
    password?: string
    vehicleNumber?: string
    isApproved?: boolean
    verificationStatus?: 'pending' | 'approved' | 'rejected'
    items?: any[]
}

interface UserState {
    user: User | null
    language: string | null
    setUser: (user: User | null) => void
    setLanguage: (lang: string) => void
    logout: () => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            language: 'en',
            setUser: (user) => set({ user }),
            setLanguage: (lang) => set({ language: lang }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
