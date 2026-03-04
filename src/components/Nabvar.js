import Image from 'next/image';
import { Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full h-16 bg-white shadow-md z-50 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Image 
          src="/logo-ut.png" 
          alt="Logo UT" 
          width={40} 
          height={40} 
        />
        <span className="font-bold text-red-700 text-lg hidden sm:block">
          Mapa UT
        </span>
      </div>
      
      <button className="p-2 text-gray-700">
        <Menu size={24} />
      </button>
    </nav>
  );
}