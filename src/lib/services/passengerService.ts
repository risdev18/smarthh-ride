import { db } from "../firebase";
import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    orderBy
} from "@firebase/firestore";

export interface PassengerData {
    id?: string;
    name: string;
    phone: string;
    email?: string;
    role: string;
    createdAt: any;
}

const PASSENGERS_COLLECTION = "passengers";

export const passengerService = {
    // Listen to all passengers
    listenToPassengers(callback: (passengers: PassengerData[]) => void) {
        const q = query(
            collection(db, PASSENGERS_COLLECTION),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {
            const passengers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as PassengerData));
            callback(passengers);
        });
    },

    // Delete a passenger
    async deletePassenger(passengerId: string) {
        const passengerRef = doc(db, PASSENGERS_COLLECTION, passengerId);
        await deleteDoc(passengerRef);
    }
};
