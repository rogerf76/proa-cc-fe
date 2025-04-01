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

interface MeasurementRecord {
    id: number;
    property_id: number;
    variable_name: string;
    value: number;
    timestamp: Date;
}

export interface VariableRecord {
    id: number;
    variable_id: number;
    variable_name: string;
    long_name: string;
    unit: string;
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
    const [measurements, setMeasurements] = useState<MeasurementRecord[] | null>(null);
    const [variables, setVariables] = useState<VariableRecord[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch variables if not already fetched
                if (!variables) {
                    const variablesResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/variables`);
                    const variablesData = await variablesResponse.json();
                    setVariables(variablesData);
                }

                // Fetch measurements
                const measurementsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/measurements/${marker.id}`);
                const measurementsData = await measurementsResponse.json();
                setMeasurements(measurementsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [marker.id, variables]);

    return (
        <div>
            <div className="grid grid-cols-4 gap-1">
                <LabelValue label="Name" value={marker.ws_name} />
                <LabelValue label="Site" value={marker.site} />
                <LabelValue label="Portfolio" value={marker.portfolio} />
                <LabelValue label="State" value={marker.state} />
            </div>
            
            {measurements && variables && (
                <div className="mt-4">
                    <h3 className="font-bold mb-2">Measurements:</h3>
                    <div className="text-sm">
                        {measurements.map((record) => {
                            const variable = variables.find(v => v.variable_name === record.variable_name);
                            return (
                                <div key={record.id} className="mb-2">
                                    <div>
                                        <span className="font-bold">
                                            {variable ? variable.long_name : record.variable_name}:
                                        </span> {record.value} {variable?.unit}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(record.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export interface MainMapComponentProps {
    selectedState?: string;
}

export const MainMapComponent: React.FC<MainMapComponentProps> = ({ selectedState }) => {
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

    const filteredMarkers = selectedState 
        ? markers.filter(marker => marker.state === selectedState)
        : markers;

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
            {filteredMarkers.map(marker => (
                <Marker
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    color={marker.color}
                    onClick={() => {
                        // Reset selected marker first, to clear measurements state from previous marker
                        setSelectedMarker(null);
                        setTimeout(() => setSelectedMarker(marker), 0);
                    }}
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
