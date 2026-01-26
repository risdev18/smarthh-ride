import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp, updateDoc, doc } from "@firebase/firestore";

const RIDES_COLLECTION = "rides";

export interface Ride {
    id?: string;
    passengerId: string;
    driverId?: string;
    passengerName: string;
    driverName?: string;
    pickup: string;
    drop: string;
    fare: number;
    status: 'pending' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
    paymentMethod: 'cash' | 'upi';
    createdAt: any;
    cancelReason?: string;
}

export const rideService = {
    // Create a new ride request
    async createRide(rideData: Omit<Ride, 'id' | 'createdAt' | 'status'>) {
        try {
            const docRef = await addDoc(collection(db, RIDES_COLLECTION), {
                ...rideData,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating ride:", error);
            throw error;
        }
    },

    // Fetch passenger ride history
    async getPassengerHistory(passengerId: string): Promise<Ride[]> {
        try {
            const q = query(
                collection(db, RIDES_COLLECTION),
                where("passengerId", "==", passengerId),
                orderBy("createdAt", "desc"),
                limit(50)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Ride[];
        } catch (error) {
            console.error("Error fetching passenger history:", error);
            return [];
        }
    },

    // Fetch driver ride history
    async getDriverHistory(driverId: string): Promise<Ride[]> {
        try {
            const q = query(
                collection(db, RIDES_COLLECTION),
                where("driverId", "==", driverId),
                where("status", "==", "completed"),
                orderBy("createdAt", "desc"),
                limit(50)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Ride[];
        } catch (error) {
            console.error("Error fetching driver history:", error);
            return [];
        }
    },

    // Update ride status
    async updateRideStatus(rideId: string, status: Ride['status']) {
        try {
            const rideRef = doc(db, RIDES_COLLECTION, rideId);
            await updateDoc(rideRef, { status });
            return true;
        } catch (error) {
            console.error("Error updating ride status:", error);
            throw error;
        }
    },

    // Accept a ride (Driver)
    async acceptRide(rideId: string, driverId: string, driverName: string) {
        try {
            const rideRef = doc(db, RIDES_COLLECTION, rideId);
            await updateDoc(rideRef, {
                driverId,
                driverName,
                status: 'accepted'
            });
            return true;
        } catch (error) {
            console.error("Error accepting ride:", error);
            throw error;
        }
    },

    // Cancel a ride
    async cancelRide(rideId: string, reason: string) {
        try {
            const rideRef = doc(db, RIDES_COLLECTION, rideId);
            await updateDoc(rideRef, {
                status: 'cancelled',
                cancelReason: reason
            });
            return true;
        } catch (error) {
            console.error("Error cancelling ride:", error);
            throw error;
        }
    }
};
