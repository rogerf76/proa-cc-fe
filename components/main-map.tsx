'use client';
import React, { useState, useEffect } from 'react';

// Using Mapbox
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MarkerData {
    id: number;
    longitude: number;
    latitude: number;

    ws_name: string;
    site: string;
    portfolio: string;
    state: string;

    color: string;
}

interface Measurements {
    // Add measurement fields as needed
    [key: string]: any;
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

interface PopupBodyProps {
    marker: MarkerData;
}

interface LabelValueProps {
    label: string;
    value: string;
}

const LabelValue: React.FC<LabelValueProps> = ({ label, value }) => (
    <>
        <div><span className="font-bold">{label}:</span></div>
        <div className="col-span-3"><span>{value}</span></div>
    </>
);

const PopupBody: React.FC<PopupBodyProps> = ({ marker }) => {
    const [measurements, setMeasurements] = useState<Measurements | null>(null);

    useEffect(() => {
        const fetchMeasurements = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/measurements/${marker.id}`);
                const data = await response.json();
                setMeasurements(data);
            } catch (error) {
                console.error('Error fetching measurements:', error);
            }
        };

        fetchMeasurements();
    }, [marker.id]);

    return (
        <div>
            <div className="grid grid-cols-4 gap-1">
                <LabelValue label="Name" value={marker.ws_name} />
                <LabelValue label="Site" value={marker.site} />
                <LabelValue label="Portfolio" value={marker.portfolio} />
                <LabelValue label="State" value={marker.state} />
            </div>
            
            {measurements && (
                <div className="mt-4">
                    <h3 className="font-bold mb-2">Measurements:</h3>
                    <pre className="text-sm">
                        {JSON.stringify(measurements, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

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
                    ws_name: item.ws_name,
                    site: item.site,
                    portfolio: item.portfolio,
                    state: item.state,
                    color: "red"
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
                    onClick={() => setSelectedMarker(marker) }
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
                    <PopupBody marker={selectedMarker} />
                </Popup>
            )}
        </Map>
    );
};
