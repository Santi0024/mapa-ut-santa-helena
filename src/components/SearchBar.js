'use client';

import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="absolute top-20 left-4 right-4 z-[1000] md:left-auto md:right-4 md:w-96">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar edificio, bloque, servicio..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-3 pl-12 rounded-lg shadow-lg border border-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                     bg-white text-gray-700 placeholder-gray-400"
        />
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={20} 
        />
        
        {/* Botón de limpiar búsqueda */}
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                       text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}