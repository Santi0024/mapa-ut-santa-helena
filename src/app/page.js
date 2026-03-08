import dynamic from 'next/dynamic';

// Importa MapComponent solo en el cliente (sin SSR)
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <p className="text-gray-600">Cargando mapa de la UT...</p>
    </div>
  )
});

export default function Home() {
  // ✅ Sin contenedor extra: MapComponent ya maneja todo el layout
  return <MapComponent />;
}