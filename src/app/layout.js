import "./globals.css";
import Image from 'next/image';
import { Menu } from 'lucide-react';

// Navbar definido directamente aquí
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-[9999] flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Image 
          src="/logo-ut.png" 
          alt="Logo UT" 
          width={40} 
          height={40} 
          className="object-contain"
        />
        <span className="font-bold text-red-700 text-lg hidden sm:block">
          Mapa UT
        </span>
      </div>
      
      <button className="p-2 text-gray-700 hover:bg-gray-100 rounded">
        <Menu size={24} />
      </button>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}