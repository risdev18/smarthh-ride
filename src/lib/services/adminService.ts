import { db } from "../firebase";
import { collection, doc, updateDoc, getDocs, query, where, orderBy, limit } from "@firebase/firestore";
import { UnifiedUser } from "./authService";

const USERS_COLLECTION = "users";

export const adminService = {
    // Fetch all drivers
    async getAllDrivers(): Promise<UnifiedUser[]> {
        try {
            const q = query(
                collection(db, USERS_COLLECTION),
                where("role", "==", "driver")
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UnifiedUser[];
        } catch (error) {
            console.error("Error fetching drivers:", error);
            throw error;
        }
    },

    // Update driver verification status
    async updateDriverStatus(driverId: string, status: 'approved' | 'rejected' | 'pending') {
        try {
            const driverRef = doc(db, USERS_COLLECTION, driverId);
            await updateDoc(driverRef, {
                verificationStatus: status,
                isApproved: status === 'approved'
            });
            return true;
        } catch (error) {
            console.error("Error updating driver status:", error);
            throw error;
        }
    },

    // Fetch dashboard stats
    async getStats() {
        try {
            const drivers = await this.getAllDrivers();
            const active = drivers.filter(d => d.isApproved && d.availabilityStatus === 'online').length;
            const approved = drivers.filter(d => d.isApproved).length;
            const pending = drivers.filter(d => d.verificationStatus === 'pending' || !d.verificationStatus).length;

            return {
                totalDrivers: drivers.length,
                activeDrivers: active,
                approvedDrivers: approved,
                pendingApprovals: pending
            };
        } catch (error) {
            console.error("Error fetching stats:", error);
            throw error;
        }
    },

    // Fetch all rides (System wide)
    async getAllRides(limitCount: number = 50) {
        try {
            const q = query(
                collection(db, "rides"),
                orderBy("createdAt", "desc"),
                limit(limitCount)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching all rides:", error);
            return [];
        }
    },

    // Fetch active drivers list
    async getActiveDrivers(): Promise<UnifiedUser[]> {
        try {
            const drivers = await this.getAllDrivers();
            return drivers.filter(d => d.isApproved && d.availabilityStatus === 'online');
        } catch (error) {
            console.error("Error fetching active drivers:", error);
            throw error;
        }
    }
};
