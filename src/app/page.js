import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-100">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      <p className="text-gray-600">Cargando mapa de la UT...</p>
    </div>
  )
});

export default function Home() {
  return <MapComponent />;
}