'use client';
import React from 'react';

// Using Mapbox
import Map, {Marker} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MainMapComponent = () => {
    return (
        <Map
            initialViewState={{
                latitude: 37.8,
                longitude: -122.4,
                zoom: 14
            }}
            
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        >
            <Marker longitude={-122.4} latitude={37.8} color="red" />
        </Map>
    );
};
