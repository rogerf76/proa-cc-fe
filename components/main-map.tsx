'use client';
import React from 'react';

// Using Mapbox
import Map, {Marker} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';



export const MainMapComponent = () => {
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
            <Marker longitude={-122.4} latitude={37.8} color="red" />
        </Map>
    );
};
