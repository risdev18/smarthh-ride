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
    showUserLocation = true
}: {
    center?: { lat: number, lng: number }
    zoom?: number
    showUserLocation?: boolean
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
            </MapContainer>
        </div>
    )
}
