"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, History, Settings, LogOut, Thermometer } from "lucide-react";

const menuItems = [
  { name: "Panel", href: "/dashboard", icon: LayoutDashboard },
  { name: "Equipos", href: "/dashboard/dispositivos", icon: Thermometer }, // Nombre corto ideal para móvil
  { name: "Historial", href: "/dashboard/historial", icon: History },      // ✅ Ya estaba incluido, lo mantenemos
  { name: "Ajustes", href: "/dashboard/ajustes", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // 1. Borrar sesión
    localStorage.removeItem("usuario_gasalert");
    // 2. Ir al login
    router.push("/");
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-slate-200 md:hidden pb-safe">
      <nav className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          // Lógica mejorada (igual que en Sidebar):
          // Se activa si es la ruta exacta O si es una sub-ruta (excepto para el dashboard raíz)
          const isActive = 
            pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-400 hover:text-blue-500"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-medium mt-1 ${isActive ? "font-bold" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
        
        <button 
            onClick={handleLogout}
            className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-red-600 transition-colors"
        >
            <LogOut size={24} strokeWidth={2} />
            <span className="text-[10px] font-medium mt-1">Salir</span>
        </button>
      </nav>
    </div>
  );
}