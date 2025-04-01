'use client';
import React, { useState, useEffect } from 'react';

// Using Mapbox
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MarkerData {
    id: number;
    longitude: number;
    latitude: number;
    color: string;
}

interface ApiMarker {
    id: number;
    ws_name: string;
    site: string;
    portfolio: string;
    state: string;
    latitude: string;
    longitude: string;
}

export const MainMapComponent = () => {
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mapdata`);
                const data: ApiMarker[] = await response.json();

                const transformedMarkers: MarkerData[] = data.map(item => ({
                    id: item.id,
                    longitude: parseFloat(item.longitude),
                    latitude: parseFloat(item.latitude),
                    color: "red" // You can customize this based on portfolio or other criteria
                }));

                setMarkers(transformedMarkers);
            } catch (error) {
                console.error('Error fetching markers:', error);
            }
        };

        fetchMarkers();
    }, []);

    return (
        <Map
            initialViewState={{
                // Geographic center of Australia
                latitude: -25.2744,
                longitude: 133.7751,
                // About right for HD, desktop
                zoom: 4.0
            }}

            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
            {markers.map(marker => (
                <Marker
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    color={marker.color}
                    onClick={() => {
                        console.log('clicked marker', marker);
                        setSelectedMarker(marker)
                    }
                    }
                />
            ))}

            {selectedMarker && (
                <Popup
                    longitude={selectedMarker.longitude}
                    latitude={selectedMarker.latitude}
                    onClose={() => setSelectedMarker(null)}
                    closeOnClick={false}
                    anchor="bottom"
                >
                    Some Text
                </Popup>
            )}
        </Map>
    );
};
