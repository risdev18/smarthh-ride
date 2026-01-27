import { db } from "../firebase";
import { collection, query, where, getDocs, GeoPoint } from "@firebase/firestore";
import { Coordinates, findNearbyDrivers, DriverCandidate, calculateDistance } from '@/lib/geo/utils';

const DRIVERS_COLLECTION = "drivers";

export class MatchingService {
    private static instance: MatchingService;

    private constructor() { }

    static getInstance(): MatchingService {
        if (!MatchingService.instance) {
            MatchingService.instance = new MatchingService();
        }
        return MatchingService.instance;
    }

    /**
     * Finds the best drivers by querying Firestore for online and approved drivers,
     * then filtering/sorting them using geospatial utilities.
     */
    async findBestDrivers(pickup: Coordinates, radius: number = 5): Promise<DriverCandidate[]> {
        try {
            // 1. Fetch Online & Approved drivers from Firestore
            const q = query(
                collection(db, DRIVERS_COLLECTION),
                where("status", "==", "online"),
                where("isApproved", "==", true)
            );

            const snapshot = await getDocs(q);

            // 2. Map Firestore docs to DriverCandidate objects
            const drivers: DriverCandidate[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    location: data.location as Coordinates,
                    rating: data.rating || 4.5, // Fallback rating
                    lastActiveTime: data.lastActiveTime || Date.now(),
                    status: data.status,
                    verificationStatus: data.isApproved ? 'approved' : 'pending'
                } as DriverCandidate;
            });

            // 3. Filter and Sort using our robust geo utility
            // This handles distance filtering, sorting by distance, rating, and fair distribution.
            return findNearbyDrivers(pickup, drivers, radius);

        } catch (error) {
            console.error("Error in matching service:", error);
            return [];
        }
    }

    /**
     * Simulation for driver notification logic
     */
    async dispatchRequest(rideId: string, drivers: DriverCandidate[]) {
        if (drivers.length === 0) {
            console.log(`No eligible drivers found for ride ${rideId}`);
            return;
        }

        console.log(`Dispatching ride ${rideId} to ${drivers.length} pilots...`);
        // In a real environment, this would hit a Pub/Sub or WebSocket hub
    }
}
