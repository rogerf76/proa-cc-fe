'use client';
import { MainMapComponent } from '@/components/main-map';
import { useState } from 'react';

const AUSTRALIAN_STATES = [
    { id: 'NSW', name: 'New South Wales' },
    { id: 'VIC', name: 'Victoria' },
    { id: 'QLD', name: 'Queensland' },
    { id: 'WA', name: 'Western Australia' },
    { id: 'SA', name: 'South Australia' },
    { id: 'TAS', name: 'Tasmania' },
    { id: 'ACT', name: 'Australian Capital Territory' },
    { id: 'NT', name: 'Northern Territory' }
];

export default function Home() {
    const [selectedState, setSelectedState] = useState<string>('');

    return (
        <div className="flex flex-col h-screen">
            <nav className="bg-gray-800 text-white p-4">
                {/* Top menu bar content */}
                <h1 className="text-xl font-bold">Roger French - Proa technical interview submission</h1>
            </nav>
            <div className="flex flex-col md:flex-row h-full w-full">
                <div className="h-32 md:h-full md:w-64 bg-gray-100 p-4">
                    {/* Sidebar content */}
                    <div className="space-y-4">
                        <h2 className="font-semibold text-black">Navigation</h2>
                        <div>
                            <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-1">
                                Select State
                            </label>
                            <select
                                id="state-select"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                            >
                                <option value="">All States</option>
                                {AUSTRALIAN_STATES.map((state) => (
                                    <option key={state.id} value={state.id}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <main className="flex-1">
                    <MainMapComponent selectedState={selectedState} />
                </main>
            </div>
        </div>
    );
}
