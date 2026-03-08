'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchBar from './SearchBar';
import edificiosData from '../data/edificios.json';
import { Locate } from 'lucide-react';

// Iconos por categoría
const iconosPorTipo = {
  academico: L.icon({
    iconUrl: '/pin-rojo.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  servicio: L.icon({
    iconUrl: '/pin-verde.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  deportivo: L.icon({
    iconUrl: '/pin-azul.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  administrativo: L.icon({
    iconUrl: '/pin-naranja.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  cultural: L.icon({
    iconUrl: '/pin-morado.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  })
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
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distancia = R * c;
  return distancia * 1000; // Retornar en metros
}

// Componente para manejar la ubicación del usuario
function LocationButton({ onLocationFound, userLocation }) {
  const map = useMapEvents({
    locationfound: (e) => {
      onLocationFound([e.latlng.lat, e.latlng.lng]);
    }
  });

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 18, enableHighAccuracy: true });
  };

  return (
    <button
      onClick={handleLocate}
      className={`absolute bottom-24 right-4 z-[1000] p-3 rounded-full shadow-lg 
                 ${userLocation 
                   ? 'bg-green-600 hover:bg-green-700' 
                   : 'bg-blue-600 hover:bg-blue-700'} 
                 text-white transition-all active:scale-95`}
      title="Mi ubicación"
    >
      <Locate size={24} />
    </button>
  );
}

// Marcador de ubicación del usuario
function UserMarker({ position }) {
  if (!position) return null;

  const userIcon = L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <h3 className="font-bold text-blue-700">📍 Tú estás aquí</h3>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Filtrar edificios según la búsqueda
  const edificiosFiltrados = edificiosData.filter((edificio) =>
    edificio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edificio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edificio.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar ubicación encontrada
  const handleLocationFound = (coords) => {
    setUserLocation(coords);
    setLoadingLocation(false);
    setLocationError(null);
  };

  // Pedir ubicación al cargar
  useEffect(() => {
    setLoadingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLoadingLocation(false);
        },
        (error) => {
          console.log('Permiso de ubicación denegado o no disponible');
          setLoadingLocation(false);
          setLocationError('Ubicación no disponible');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLoadingLocation(false);
      setLocationError('Geolocalización no soportada');
    }
  }, []);

  return (
    <div className="relative h-screen">
      {/* Barra de Búsqueda Flotante */}
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
      {loadingLocation && (
        <div className="absolute top-40 left-2 sm:left-4 z-[1000] bg-blue-100 px-3 py-2 rounded-lg shadow-md">
          <span className="text-xs sm:text-sm text-blue-700">📍 Obteniendo ubicación...</span>
        </div>
      )}

      {locationError && (
        <div className="absolute top-40 left-2 sm:left-4 z-[1000] bg-orange-100 px-3 py-2 rounded-lg shadow-md">
          <span className="text-xs sm:text-sm text-orange-700">⚠️ {locationError}</span>
        </div>
      )}

      {/* Leyenda de colores - Solo desktop */}
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

      {/* Botón de ubicación */}
      <LocationButton 
        onLocationFound={handleLocationFound} 
        userLocation={userLocation} 
      />

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
        tap={true}
        tapTolerance={15}
      >
        <ZoomControl position="bottomright" />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
          maxZoom={18}
        />
        
        {/* Marcador del usuario */}
        <UserMarker position={userLocation} />
        
        {/* Edificios con distancia */}
        {edificiosFiltrados.map((edificio) => {
          const distancia = userLocation 
            ? calcularDistancia(userLocation[0], userLocation[1], edificio.coord[0], edificio.coord[1])
            : null;

          return (
            <Marker 
              key={edificio.id} 
              position={edificio.coord}
              icon={iconosPorTipo[edificio.tipo] || iconosPorTipo.academico}
              eventHandlers={{
                click: (e) => {
                  e.target.openPopup();
                }
              }}
            >
              <Popup 
                maxWidth={280}
                minWidth={200}
                className="custom-popup"
              >
                <div className="text-center min-w-[200px] p-1">
                  <h3 className={`font-bold text-lg ${coloresPorTipo[edificio.tipo]}`}>
                    {edificio.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{edificio.descripcion}</p>
                  
                  {/* Distancia si hay ubicación del usuario */}
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