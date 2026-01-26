import { auth, db } from "../firebase";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
    PhoneAuthProvider,
    signInWithCredential,
    GoogleAuthProvider,
    signInWithPopup
} from "@firebase/auth";
import { collection, addDoc, getDocs, query, where, limit, serverTimestamp, doc, setDoc } from "@firebase/firestore";

export type UserRole = 'passenger' | 'driver' | 'admin';

export interface UnifiedUser {
    id?: string;
    name: string;
    phone: string;
    role: UserRole;
    createdAt: any;
    // Driver specific
    vehicleNumber?: string;
    isApproved?: boolean;
    status?: string;
    // Passenger specific
    savedLocations?: any[];
}

const COLLECTIONS = {
    passenger: "passengers",
    driver: "drivers",
    admin: "admins"
};

// Store confirmation result globally
let confirmationResult: ConfirmationResult | null = null;

export const otpAuthService = {
    // Initialize reCAPTCHA
    initRecaptcha(containerId: string = 'recaptcha-container') {
        try {
            if (typeof window === 'undefined') return null;

            // Clear existing reCAPTCHA if any
            if ((window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier.clear();
            }

            const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                'size': 'invisible',
                'callback': () => {
                    console.log('reCAPTCHA solved');
                },
                'expired-callback': () => {
                    console.log('reCAPTCHA expired');
                }
            });

            (window as any).recaptchaVerifier = recaptchaVerifier;
            return recaptchaVerifier;
        } catch (error) {
            console.error("Error initializing reCAPTCHA:", error);
            return null;
        }
    },

    // Send OTP to phone number
    async sendOTP(phoneNumber: string): Promise<boolean> {
        try {
            // Ensure phone number has country code
            const formattedPhone = phoneNumber.startsWith('+91')
                ? phoneNumber
                : `+91${phoneNumber.replace(/\D/g, '')}`;

            console.log("Sending OTP to:", formattedPhone);

            const recaptchaVerifier = (window as any).recaptchaVerifier || otpAuthService.initRecaptcha();

            if (!recaptchaVerifier) {
                throw new Error("Failed to initialize reCAPTCHA");
            }

            confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
            console.log("OTP sent successfully");
            return true;
        } catch (error: any) {
            console.error("Error sending OTP:", error);

            // Clear reCAPTCHA on error
            if ((window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier.clear();
                (window as any).recaptchaVerifier = null;
            }

            throw new Error(error.message || "Failed to send OTP");
        }
    },

    // Verify OTP and login/register
    async verifyOTP(otp: string, role: UserRole, name?: string, vehicleNumber?: string): Promise<UnifiedUser> {
        try {
            if (!confirmationResult) {
                throw new Error("No OTP sent. Please request OTP first.");
            }

            console.log("Verifying OTP...");
            const result = await confirmationResult.confirm(otp);
            const user = result.user;

            if (!user.phoneNumber) {
                throw new Error("Phone number not found");
            }

            console.log("OTP verified for:", user.phoneNumber);

            // Check if user exists in the database
            const existingUser = await otpAuthService.getUserByPhone(user.phoneNumber, role);

            if (existingUser) {
                console.log("Existing user found:", existingUser.id);
                return existingUser;
            }

            // New user - create account
            if (!name) {
                throw new Error("Name is required for new users");
            }

            console.log("Creating new user account...");
            const userId = await otpAuthService.createUser({
                name,
                phone: user.phoneNumber,
                role,
                vehicleNumber: role === 'driver' ? vehicleNumber : undefined
            });

            return {
                id: userId,
                name,
                phone: user.phoneNumber,
                role,
                vehicleNumber,
                createdAt: new Date(),
                isApproved: role === 'driver' ? false : true,
                status: role === 'driver' ? 'incomplete' : 'approved'
            };

        } catch (error: any) {
            console.error("Error verifying OTP:", error);
            throw new Error(error.message || "Invalid OTP");
        }
    },

    // Create new user in Firestore
    async createUser(data: Omit<UnifiedUser, 'id' | 'createdAt'>): Promise<string> {
        try {
            const collectionName = COLLECTIONS[data.role];

            // Check if user already exists
            const existing = await otpAuthService.getUserByPhone(data.phone, data.role);
            if (existing) {
                throw new Error(`User already exists as ${data.role}`);
            }

            const payload: any = {
                name: data.name,
                phone: data.phone,
                role: data.role,
                createdAt: serverTimestamp(),
                isApproved: data.role === 'driver' ? false : true,
                status: data.role === 'driver' ? 'incomplete' : 'approved',
            };

            if (data.role === 'driver') {
                payload.vehicleNumber = data.vehicleNumber || '';
                payload.documents = {};
            }

            const docRef = await addDoc(collection(db, collectionName), payload);
            console.log("User created with ID:", docRef.id);
            return docRef.id;

        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // Get user by phone number
    async getUserByPhone(phone: string, role: UserRole): Promise<UnifiedUser | null> {
        try {
            const q = query(
                collection(db, COLLECTIONS[role]),
                where("phone", "==", phone),
                limit(1)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() } as UnifiedUser;
            }

            return null;
        } catch (error) {
            console.error("Error getting user by phone:", error);
            return null;
        }
    },

    // Admin login (special case - no OTP)
    async adminLogin(username: string, password: string): Promise<UnifiedUser | null> {
        if (username === "Rishabh@41@45" && password === "5676") {
            return {
                id: "admin_1",
                name: "Rishabh Admin",
                phone: "Rishabh@41@45",
                role: 'admin',
                createdAt: new Date()
            };
        }
        return null;
    },

    // Google Sign In
    async signInWithGoogle(role: UserRole): Promise<UnifiedUser> {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Allow email as identifier for Google users, but we still need phone number
            // or we just use email as the unique key for lookup. 
            // For this app, let's treat the email as the "phone" field or add email support.
            // Simplified: Use email as the identifier

            const identifier = user.email || user.phoneNumber || user.uid;

            // Check if user exists
            const q = query(
                collection(db, COLLECTIONS[role]),
                where("email", "==", user.email), // Check by email
                limit(1)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return { id: doc.id, ...doc.data() } as UnifiedUser;
            }

            // New user create
            const collectionName = COLLECTIONS[role];
            const payload: any = {
                name: user.displayName || "Google User",
                email: user.email,
                phone: user.phoneNumber || "", // Might be empty
                role: role,
                createdAt: serverTimestamp(),
                isApproved: role === 'driver' ? false : true,
                status: role === 'driver' ? 'incomplete' : 'approved',
                authProvider: 'google'
            };

            const docRef = await addDoc(collection(db, collectionName), payload);
            return {
                id: docRef.id,
                ...payload,
                createdAt: new Date() // specific type match
            } as UnifiedUser;

        } catch (error: any) {
            console.error("Error with Google Sign In:", error);
            throw new Error(error.message || "Google Sign In Failed");
        }
    }
};
