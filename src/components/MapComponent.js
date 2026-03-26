'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
import 'leaflet-rotate';
import SearchBar from './SearchBar';
import edificiosData from '../data/edificios.json';

// Colores por categoría cambia letra y color del poligono
const coloresPorTipo = {
  academico: '#1c42fe',
  servicio: '#ffee06',
  deportivo: '#3b82f6',
  administrativo: '#f59e0b',
  cultural: '#8b5cf6'
};

// CONTORNO DEL CAMPUS - Coordenadas del polígono que delimita el campus
const contornoUT = [
  [4.426091, -75.216219],
  [4.427244, -75.216404],
  [4.427685, -75.216125],
  [4.428142, -75.216200],
  [4.428482, -75.214972],
  [4.429035, -75.214087],
  [4.429185, -75.214122],
  [4.429418, -75.213714],
  [4.428562, -75.213499],
  [4.428530, -75.211633],
  [4.428452, -75.211214],
  [4.427848, -75.210222],
  [4.428067, -75.210114],
  [4.427821, -75.209669], 
  [4.427827, -75.209087],
  [4.427142, -75.209101],
  [4.427083, -75.210713],
  [4.426008, -75.212089],
  [4.426011, -75.212534], 
  [4.426096, -75.216216],
  [4.426091, -75.216219]
];


// Función para calcular distancia
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

// Icono para ubicación del usuario
const userIcon = L.divIcon({
  className: 'user-marker',
  html: `<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// ========== COMPONENTE PRINCIPAL ==========
export default function MapComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Marcar como montado (previene doble render en desarrollo)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filtrar edificios (memoizado para evitar recálculos)
  const edificiosFiltrados = useMemo(() => {
    return edificiosData.filter((edificio) =>
      edificio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edificio.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      edificio.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Obtener ubicación
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          // Verificar si las coordenadas están dentro del campus aproximadamente
          const latMin = 4.425299;
          const latMax = 4.429995;
          const lonMin = -75.218309;
          const lonMax = -75.208191;
          
          if (coords[0] >= latMin && coords[0] <= latMax && 
              coords[1] >= lonMin && coords[1] <= lonMax) {
            // Usuario está en el campus
            setUserLocation(coords);
          } else {
            // Usuario está fuera del campus - usar centro del campus
            console.log('Usuario fuera del campus, centrando en Santa Helena');
            setUserLocation([4.427647, -75.213342]);
          }
        },
        (error) => {
          console.log('Ubicación no disponible:', error.message);
          setLocationError('Ubicación no disponible');
          // Usar centro del campus por defecto
          setUserLocation([4.427647, -75.213342]);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationError('Geolocalización no soportada');
      setUserLocation([4.427647, -75.213342]);
    }
  }, []);

  const handleLocate = () => {
    if (userLocation) {
      window.location.reload();
    }
  };

  // No renderizar hasta que esté montado en el cliente
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    );
  }

  // ========== RETURN ==========
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
      
      {/* CAPA DE CONTROLES */}
      <div className="absolute inset-0 pointer-events-none z-[1000]">
        
        {/* Barra de Búsqueda */}
        <div className="absolute top-14 sm:top-16 left-2 right-2 sm:left-4 sm:right-4 pointer-events-auto">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
      
        
        {/* Contador de resultados */}
        {searchTerm && (
          <div className="absolute top-32 sm:top-36 left-2 sm:left-4 pointer-events-auto bg-white/95 backdrop-blur px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-md">
            <span className="text-xs text-gray-600 font-medium">
              {edificiosFiltrados.length} resultado{edificiosFiltrados.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Estado de ubicación */}
        {locationError && (
          <div className="absolute top-32 sm:top-36 left-2 sm:left-4 pointer-events-auto bg-orange-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-md">
            <span className="text-xs text-orange-700">⚠️ {locationError}</span>
          </div>
        )}

        {/* Botón de ubicación */}
        <button
          onClick={handleLocate}
          className="absolute bottom-20 sm:bottom-24 right-3 sm:right-4 pointer-events-auto p-2.5 sm:p-3 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-all active:scale-95"
          title="Mi ubicación"
        >
          📍
        </button>

        {/* Leyenda - Solo desktop */}
        <div className="absolute bottom-20 left-2 sm:left-4 pointer-events-auto bg-white/95 backdrop-blur px-2 sm:px-3 py-2 rounded-lg shadow-md hidden sm:block">
          <p className="text-xs font-bold text-gray-700 mb-1">Leyenda:</p>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: coloresPorTipo.academico }}></span>
              <span>Académico</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: coloresPorTipo.servicio }}></span>
              <span>Servicios</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: coloresPorTipo.deportivo }}></span>
              <span>Deportivo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: coloresPorTipo.administrativo }}></span>
              <span>Administrativo</span>
            </div>
              <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: coloresPorTipo.cultural }}></span>
              <span>Cultural</span>
          </div>
        </div>
       </div> 
      </div>
        
      {/* MAPA */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[4.4269, -75.2132]}
          zoom={18}
          minZoom={15}
          maxZoom={19}
          rotate={true}
          bearing={0} // Permite rotar el mapa
          maxBounds={[[4.425299, -75.218309], [4.429995, -75.208191]]}
          maxBoundsViscosity={0.5}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={false}
           whenCreated={(map) => {
           map.on("click", (e) => {
           setUserLocation([e.latlng.lat, e.latlng.lng]);
    });
  }}
        >
          <ZoomControl position="bottomright" />
        
                 {/* MAPA */}
                <TileLayer
                 attribution='&copy; OpenStreetMap contributors'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 maxZoom={19}    
                  
          />     {/* CONTORNO DEL CAMPUS CON COLOR */}
                   <Polygon
                   positions={contornoUT}
                   pathOptions={{
                   color: "#a7f0f5",
                   weight: 4,
                   fillColor: "red",
                  fillOpacity: 0.8
                }}  
           ></Polygon>

          {/* Marcador del usuario (solo si está en el campus) */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup maxWidth={300} minWidth={200}>
                <div className="text-center">
                  <h3 className="font-bold text-blue-700 text-sm">📍 Tú estás aquí</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Edificios */}
          {edificiosFiltrados.map((edificio) => {
            const distancia = userLocation 
              ? calcularDistancia(userLocation[0], userLocation[1], edificio.coord[0], edificio.coord[1])
              : null;

            const tipoLower = edificio.tipo
                 .toLowerCase()
                 .normalize("NFD")
                 .replace(/[\u0300-\u036f]/g, "") // quita tildes
                 .trim();

              const colorTipo = coloresPorTipo[tipoLower] || '#6b7280'; // Gris por defecto

            return (
              <Polygon  
                key={edificio.id}
                positions={edificio.polygon}
                pathOptions={{
                  color: colorTipo,
                  weight: 2,
                  fillColor: colorTipo,
                  fillOpacity: 0.8
                }}

             > <Popup maxWidth={190} minWidth={100}>
                  <div style={{ textAlign: "center",
                    width: "180px",
                    
                }}>
                  <h3 style={{ fontSize: "15px", fontWeight: "bold", color: "#000" }}> {edificio.nombre} </h3>              
                   <p style={{ fontSize: "12px" }}> {edificio.tipo} </p>                                     
                   <p style={{ fontSize: "12px", color: "green" }}>
                      Horario: 6am - 9pm </p> 
                     <p style={{ fontSize: "12px", color: "#000" }}>
                       🏃‍⬅️ Recorrido: {distancia ? `${distancia.toFixed(0)} m` : "Calculando..."}
                       </p>                    
                  </div>
              </Popup>
             </Polygon>

           
            );
          })}
        </MapContainer>
      </div>
      
    </div>
  );
}