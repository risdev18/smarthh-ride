"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix Leaflet Icon
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

// Custom Car Icon for Driver
const carIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png", // Simple car icon
    iconSize: [35, 35],
    iconAnchor: [17, 17],
})

// Component to recenter map
function Recenter({ lat, lng }: { lat: number, lng: number }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo([lat, lng], map.getZoom())
    }, [lat, lng, map])
    return null
}

export default function MapComponent({
    center = { lat: 18.5204, lng: 73.8567 }, // Pune default
    zoom = 15,
    showUserLocation = true,
    driverLocation = null
}: {
    center?: { lat: number, lng: number }
    zoom?: number
    showUserLocation?: boolean
    driverLocation?: { lat: number, lng: number } | null
}) {
    return (
        <div className="h-full w-full relative z-0">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={zoom}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {showUserLocation && (
                    <>
                        <Marker position={[center.lat, center.lng]} icon={icon}>
                            <Popup>You are here</Popup>
                        </Marker>
                        <Recenter lat={center.lat} lng={center.lng} />
                    </>
                )}

                {driverLocation && (
                    <Marker position={[driverLocation.lat, driverLocation.lng]} icon={carIcon}>
                        <Popup>Driver is here</Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    )
}
