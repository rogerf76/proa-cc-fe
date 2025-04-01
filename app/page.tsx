import { MainMapComponent } from '@/components/main-map';

export default function Home() {
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
                        {/* Add sidebar items here */}
                    </div>
                </div>
                <main className="flex-1">
                    <MainMapComponent />
                </main>
            </div>
        </div>
    );
}
