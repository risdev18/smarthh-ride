import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, limit, serverTimestamp } from "@firebase/firestore";

export type UserRole = 'passenger' | 'driver' | 'admin';

export interface UnifiedUser {
    id?: string;
    name: string;
    phone: string;
    password?: string;
    role: UserRole;
    createdAt: any;
    // Driver specific
    vehicleNumber?: string;
    vehicleType?: string;
    isApproved?: boolean;
    verificationStatus?: 'pending' | 'approved' | 'rejected';
    availabilityStatus?: 'online' | 'offline';
    currentEta?: number; // In minutes
    currentLocation?: { lat: number, lng: number };
    documents?: Record<string, { status: string, url: string }>;
    // Passenger specific
    savedLocations?: any[];
}

const USERS_COLLECTION = "users";

export const authService = {
    // Signup
    async register(data: Omit<UnifiedUser, 'id' | 'createdAt'>) {
        console.log("Starting registration for:", data.phone);
        try {
            // Check if user already exists
            const existing = await authService.getUserByPhone(data.phone);
            console.log("Existing check result:", !!existing);
            if (existing) throw new Error("User with this phone number already exists.");

            // Filter out undefined values (Firestore doesn't allow them)
            const cleanData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== undefined)
            );
            console.log("Data filtered, saving to Firestore...");

            // Race against a timeout to prevent infinite hangs
            const registrationPromise = addDoc(collection(db, USERS_COLLECTION), {
                ...cleanData,
                createdAt: serverTimestamp(),
                isApproved: data.role === 'driver' ? false : true // Passengers auto-approved
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Firestore operation timed out (30s). Please check: 1. Is Firestore Database CREATED in Console? 2. Are rules set to allow writes?")), 30000)
            );

            const docRef: any = await Promise.race([registrationPromise, timeoutPromise]);

            console.log("Registration Successful! ID:", docRef.id);
            return docRef.id;
        } catch (error) {
            console.error("Error registering user: ", error);
            throw error;
        }
    },

    // Login
    async login(phone: string, password: string): Promise<UnifiedUser | null> {
        const q = query(
            collection(db, USERS_COLLECTION),
            where("phone", "==", phone),
            where("password", "==", password),
            limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as UnifiedUser;
        }
        return null;
    },

    // Fetch user by phone
    async getUserByPhone(phone: string): Promise<UnifiedUser | null> {
        const q = query(collection(db, USERS_COLLECTION), where("phone", "==", phone), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as UnifiedUser;
        }
        return null;
    }
};
