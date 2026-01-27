import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DocumentType {
    id: string
    name: string
    photoCount: number
    isMandatory: boolean
}

export interface MockDriverRegistry {
    id: string
    name: string
    status: 'active' | 'pending' | 'rejected'
    joinedDate: string
}

interface AdminState {
    documentTypes: DocumentType[]
    allDrivers: MockDriverRegistry[] // Simulated DB
    addDocumentType: (doc: DocumentType) => void
    removeDocumentType: (id: string) => void
    updateDocumentType: (id: string, updates: Partial<DocumentType>) => void
    loadDefaults: () => void
}

const defaultDocuments: DocumentType[] = [
    { id: 'driver_photo', name: 'Driver Photo', photoCount: 1, isMandatory: true },
    { id: 'aadhaar', name: 'Aadhaar Card', photoCount: 2, isMandatory: true },
    { id: 'license', name: 'Driving License', photoCount: 2, isMandatory: true },
    { id: 'rc_book', name: 'Auto RC Book', photoCount: 2, isMandatory: true },
    { id: 'auto_photo', name: 'Auto Photo (Front/Side)', photoCount: 2, isMandatory: true },
]

const mockDrivers: MockDriverRegistry[] = []

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            documentTypes: defaultDocuments,
            allDrivers: mockDrivers,
            addDocumentType: (doc) => set((state) => ({ documentTypes: [...state.documentTypes, doc] })),
            removeDocumentType: (id) => set((state) => ({ documentTypes: state.documentTypes.filter((d) => d.id !== id) })),
            updateDocumentType: (id, updates) =>
                set((state) => ({
                    documentTypes: state.documentTypes.map((d) => (d.id === id ? { ...d, ...updates } : d)),
                })),
            loadDefaults: () => set({ documentTypes: defaultDocuments, allDrivers: mockDrivers }),
        }),
        {
            name: 'smarth-admin-storage',
        }
    )
)
