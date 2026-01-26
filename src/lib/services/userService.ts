import { db } from "../firebase";
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "@firebase/firestore";
import { UnifiedUser } from "./authService";

const USERS_COLLECTION = "users";

export interface SavedLocation {
    id: string;
    label: string; // Home, Work, etc.
    address: string;
    lat: number;
    lng: number;
}

export const userService = {
    // Update Profile
    async updateProfile(userId: string, data: Partial<UnifiedUser>) {
        try {
            const userRef = doc(db, USERS_COLLECTION, userId);
            await updateDoc(userRef, data);
            return true;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    },

    // Add Saved Location
    async addSavedLocation(userId: string, location: SavedLocation) {
        try {
            const userRef = doc(db, USERS_COLLECTION, userId);
            await updateDoc(userRef, {
                savedLocations: arrayUnion(location)
            });
            return true;
        } catch (error) {
            console.error("Error adding saved location:", error);
            throw error;
        }
    },

    // Remove Saved Location
    async removeSavedLocation(userId: string, location: SavedLocation) {
        try {
            const userRef = doc(db, USERS_COLLECTION, userId);
            await updateDoc(userRef, {
                savedLocations: arrayRemove(location)
            });
            return true;
        } catch (error) {
            console.error("Error removing saved location:", error);
            throw error;
        }
    },

    // Update Preferred Areas (Drivers)
    async updatePreferredAreas(userId: string, areas: string[]) {
        try {
            const userRef = doc(db, USERS_COLLECTION, userId);
            await updateDoc(userRef, {
                preferredAreas: areas
            });
            return true;
        } catch (error) {
            console.error("Error updating preferred areas:", error);
            throw error;
        }
    }
};
