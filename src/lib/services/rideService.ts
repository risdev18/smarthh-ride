import { db } from "../firebase";
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp,
    orderBy,
    limit,
    getDocs,
    GeoPoint
} from "@firebase/firestore";

// OSRM Public Demo Server (Use standard HTTP)
const OSRM_API = "https://router.project-osrm.org/route/v1/driving";

export interface RideRequest {
    id?: string;
    passengerId: string;
    passengerName: string;
    passengerPhone: string;
    pickup: {
        address: string;
        lat: number;
        lng: number;
    };
    drop: {
        address: string;
        lat: number;
        lng: number;
    };
    fare: number;
    status: 'pending' | 'accepted' | 'arrived' | 'started' | 'completed' | 'cancelled';
    driverId?: string;
    driverName?: string;
    driverPhone?: string;
    createdAt: any;
    otp: string;
}

const RIDES_COLLECTION = "rides";

export const rideService = {
    // Passenger: Create a new ride request
    async createRideRequest(data: Omit<RideRequest, 'id' | 'createdAt' | 'status' | 'otp'>) {
        try {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();
            const docRef = await addDoc(collection(db, RIDES_COLLECTION), {
                ...data,
                status: 'pending',
                otp,
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating ride request:", error);
            throw error;
        }
    },

    // Driver: Listen for available rides (pending) - FILTERED BY LOCATION
    listenForAvailableRides(
        driverLat: number,
        driverLng: number,
        radiusKm: number,
        callback: (rides: RideRequest[]) => void
    ) {
        // Query all pending rides (Filtering happens client-side for this scale)
        // In a real production app with millions of rides, use GeoFire or Algolia.
        const q = query(
            collection(db, RIDES_COLLECTION),
            where("status", "==", "pending"),
            limit(50)
        );

        return onSnapshot(q, (snapshot) => {
            const rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RideRequest));

            // 📍 GEOSPATIAL FILTERING & SORTING
            const nearbyRides = rides.filter(ride => {
                const dist = this.calculateDistance(driverLat, driverLng, ride.pickup.lat, ride.pickup.lng);
                return dist <= radiusKm;
            }).sort((a, b) => {
                // Sort by distance first, then time
                const distA = this.calculateDistance(driverLat, driverLng, a.pickup.lat, a.pickup.lng);
                const distB = this.calculateDistance(driverLat, driverLng, b.pickup.lat, b.pickup.lng);
                return distA - distB;
            });

            callback(nearbyRides);
        });
    },

    // Helper: Calculate Haversine Distance (in km)
    calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    deg2rad(deg: number) {
        return deg * (Math.PI / 180);
    },

    // 🛣️ OSRM ROUTING (Real Roads)
    async getSmartRoute(start: { lat: number, lng: number }, end: { lat: number, lng: number }) {
        try {
            const url = `${OSRM_API}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                return {
                    coordinates: route.geometry.coordinates.map((c: number[]) => ({ lat: c[1], lng: c[0] })), // Flip [lng, lat] to {lat, lng}
                    duration: Math.round(route.duration / 60), // minutes
                    distance: (route.distance / 1000).toFixed(1) // km
                };
            }
            return null;
        } catch (e) {
            console.error("OSRM Error:", e);
            return null;
        }
    },

    // 🔄 RECOVERY: Get Active Ride for Driver
    async getDriverActiveRide(driverId: string): Promise<RideRequest | null> {
        // Check for 'accepted', 'arrived', 'started'
        const statuses = ['accepted', 'arrived', 'started'];

        // Firestore 'in' query supports up to 10 values
        const q = query(
            collection(db, RIDES_COLLECTION),
            where("driverId", "==", driverId),
            where("status", "in", statuses),
            limit(1)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as RideRequest;
        }
        return null;
    },

    // Driver: Accept a ride
    async acceptRide(rideId: string, driverId: string, driverName: string, driverPhone: string) {
        const rideRef = doc(db, RIDES_COLLECTION, rideId);
        await updateDoc(rideRef, {
            status: 'accepted',
            driverId,
            driverName,
            driverPhone
        });
    },

    // Passenger: Cancel ride
    async cancelRide(rideId: string) {
        const rideRef = doc(db, RIDES_COLLECTION, rideId);
        await updateDoc(rideRef, {
            status: 'cancelled'
        });
    },

    // Driver: Update ride status
    async updateRideStatus(rideId: string, status: RideRequest['status']) {
        const rideRef = doc(db, RIDES_COLLECTION, rideId);
        await updateDoc(rideRef, { status });
    },

    // Passenger/Driver: Listen to a specific ride
    listenToRide(rideId: string, callback: (ride: RideRequest) => void) {
        return onSnapshot(doc(db, RIDES_COLLECTION, rideId), (doc) => {
            if (doc.exists()) {
                callback({ id: doc.id, ...doc.data() } as RideRequest);
            }
        });
    },

    // Driver: Listen to earnings and stats
    listenToDriverStats(driverId: string, callback: (stats: { today: number, trips: number }) => void) {
        const q = query(
            collection(db, RIDES_COLLECTION),
            where("driverId", "==", driverId),
            where("status", "==", "completed")
        );

        return onSnapshot(q, (snapshot) => {
            let totalEarnings = 0;
            snapshot.docs.forEach(doc => {
                totalEarnings += (doc.data().fare || 0);
            });
            callback({
                today: totalEarnings,
                trips: snapshot.size
            });
        });
    }
};
