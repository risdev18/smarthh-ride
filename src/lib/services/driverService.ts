import { db } from "../firebase";
import { doc, updateDoc } from "@firebase/firestore";

const USERS_COLLECTION = "users";

export const driverService = {
    // Update driver availability (Online/Offline)
    async updateAvailability(driverId: string, status: 'online' | 'offline') {
        try {
            const driverRef = doc(db, USERS_COLLECTION, driverId);
            await updateDoc(driverRef, {
                availabilityStatus: status
            });
            return true;
        } catch (error) {
            console.error("Error updating availability:", error);
            throw error;
        }
    },

    // Update estimated time to reach pickup
    async updateEta(driverId: string, etaMinutes: number) {
        try {
            const driverRef = doc(db, USERS_COLLECTION, driverId);
            await updateDoc(driverRef, {
                currentEta: etaMinutes
            });
            return true;
        } catch (error) {
            console.error("Error updating ETA:", error);
            throw error;
        }
    },

    // Update real-time GPS location
    async updateLocation(driverId: string, location: { lat: number; lng: number }) {
        try {
            const driverRef = doc(db, USERS_COLLECTION, driverId);
            await updateDoc(driverRef, {
                currentLocation: location,
                lastLocationUpdate: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error("Error updating location:", error);
            throw error;
        }
    }
};
