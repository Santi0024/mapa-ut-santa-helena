'use client';

import { Search, X } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="w-full">
      <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100">
        <input
          type="text"
          placeholder="Buscar edificio..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-red-500 
                     bg-white text-gray-700 placeholder-gray-400
                     text-sm sm:text-base min-h-[44px]"
        />
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
          size={18}
        />
        
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 
                       p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full
                       active:bg-gray-200 min-w-[32px] min-h-[32px] flex items-center justify-center"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}