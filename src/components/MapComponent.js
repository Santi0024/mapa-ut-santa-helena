'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchBar from './SearchBar';
import edificiosData from '../data/edificios.json';
// Icono personalizado para ubicación del usuario
const userIcon = L.divIcon({
  className: 'user-marker',
  html: `
    <div style="
      width: 16px;
      height: 16px;
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
      animation: pulse 2s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
      }
    </style>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// Iconos por categoría (usando marcador por defecto si no hay imagen)
const crearIcono = (color) => {
  return new L.Icon({
    iconUrl: `/pin-${color}.png`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// Colores por categoría
const coloresPorTipo = {
  academico: 'text-red-700',
  servicio: 'text-green-700',
  deportivo: 'text-blue-700',
  administrativo: 'text-orange-700',
  cultural: 'text-purple-700'
};

// Función para calcular distancia (Fórmula Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000;
}

export default function MapComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Filtrar edificios
  const edificiosFiltrados = edificiosData.filter((edificio) =>
    edificio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edificio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edificio.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener ubicación del usuario
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Ubicación no disponible:', error.message);
          setLocationError('Ubicación no disponible');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }, []);

  // Función para centrar en ubicación del usuario
  const handleLocate = () => {
    if (userLocation) {
      // El mapa se centrará automáticamente cuando userLocation cambie
      window.location.reload(); // Solución simple para recentrar
    }
  };

  return (
    <div className="relative h-screen">
      {/* Barra de Búsqueda */}
      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />
      
      {/* Contador de resultados */}
      {searchTerm && (
        <div className="absolute top-40 sm:top-44 left-2 sm:left-4 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-md">
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            {edificiosFiltrados.length} resultado{edificiosFiltrados.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Estado de ubicación */}
      {locationError && (
        <div className="absolute top-40 left-2 sm:left-4 z-[1000] bg-orange-100 px-3 py-2 rounded-lg shadow-md">
          <span className="text-xs sm:text-sm text-orange-700">⚠️ {locationError}</span>
        </div>
      )}

      {/* Botón de ubicación */}
      <button
        onClick={handleLocate}
        className={`absolute bottom-24 right-4 z-[1000] p-3 rounded-full shadow-lg 
                   ${userLocation 
                     ? 'bg-green-600 hover:bg-green-700' 
                     : 'bg-blue-600 hover:bg-blue-700'} 
                   text-white transition-all active:scale-95`}
        title="Mi ubicación"
      >
        📍
      </button>

      {/* Leyenda - Solo desktop */}
      <div className="absolute bottom-20 left-2 sm:left-4 z-[1000] bg-white/95 backdrop-blur px-2 sm:px-3 py-2 rounded-lg shadow-md hidden sm:block">
        <p className="text-xs font-bold text-gray-700 mb-1">Leyenda:</p>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-full"></span>
            <span>Académico</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-600 rounded-full"></span>
            <span>Servicios</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
            <span>Deportes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
            <span>Admin</span>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <MapContainer 
        center={userLocation || [4.427647, -75.213342]}
        zoom={userLocation ? 18 : 17}
        minZoom={16}
        maxZoom={18}
        maxBounds={[
          [4.425299, -75.218309],
          [4.429995, -75.208191]
        ]}
        maxBoundsViscosity={0.5}
        style={{ height: "100vh", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
          maxZoom={18}
        />
        
        {/* Marcador del usuario */}
{userLocation && (
  <Marker position={userLocation} icon={userIcon}>
    <Popup>
      <div className="text-center">
        <h3 className="font-bold text-blue-700">📍 Tú estás aquí</h3>
        <p className="text-xs text-gray-500 mt-1">
          {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
        </p>
      </div>
    </Popup>
  </Marker>
)}
        
        {/* Edificios con distancia */}
        {edificiosFiltrados.map((edificio) => {
          const distancia = userLocation 
            ? calcularDistancia(userLocation[0], userLocation[1], edificio.coord[0], edificio.coord[1])
            : null;

          return (
            <Marker 
              key={edificio.id} 
              position={edificio.coord}
            >
              <Popup maxWidth={280} minWidth={200}>
                <div className="text-center min-w-[200px] p-1">
                  <h3 className={`font-bold text-lg ${coloresPorTipo[edificio.tipo]}`}>
                    {edificio.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{edificio.descripcion}</p>
                  
                  {distancia !== null && (
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-700 font-medium">
                        📍 {distancia < 1000 
                          ? `${Math.round(distancia)}m` 
                          : `${(distancia/1000).toFixed(2)}km`}
                      </span>
                      <span className="inline-block px-2 py-1 ml-1 bg-gray-100 rounded text-xs text-gray-600">
                        🚶 ~{Math.round(distancia / 80)} min
                      </span>
                    </div>
                  )}
                  
                  <div className="mt-2 space-y-1">
                    <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      📍 {edificio.tipo}
                    </span>
                    <br />
                    <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      🕐 {edificio.horario}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
// Obtener ubicación del usuario
useEffect(() => {
  console.log('🔍 Solicitando ubicación...');
  
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        console.log('✅ Ubicación obtenida:', coords);
        setUserLocation(coords);
      },
      (error) => {
        console.log('❌ Error de ubicación:', error.message);
        setLocationError('Ubicación no disponible: ' + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    console.log('❌ Geolocalización no soportada');
    setLocationError('Geolocalización no soportada');
  }
}, []);