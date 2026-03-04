import Image from 'next/image';
import { Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white shadow-lg z-[9999] flex items-center justify-between px-3 sm:px-4">
      {/* Logo y título */}
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 sm:w-10 sm:h-10">
          <Image 
            src="/logo-ut.png" 
            alt="Logo UT" 
            fill
            className="object-contain"
          />
        </div>
        <span className="font-bold text-red-700 text-sm sm:text-lg hidden sm:block">
          Mapa UT
        </span>
        <span className="font-bold text-red-700 text-sm sm:hidden">
          UT
        </span>
      </div>
      
      {/* Botón menú */}
      <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg active:bg-gray-200">
        <Menu size={24} />
      </button>
    </nav>
  );
}