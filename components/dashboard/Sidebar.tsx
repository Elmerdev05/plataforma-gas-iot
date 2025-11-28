"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, History, Settings, LogOut, Thermometer } from "lucide-react";

// Definimos los links del menú
const menuItems = [
  { name: "Panel Principal", href: "/dashboard", icon: LayoutDashboard },
  { name: "Dispositivos", href: "/dashboard/dispositivos", icon: Thermometer }, // Nuevo módulo agregado
  { name: "Historial", href: "/dashboard/historial", icon: History },
  { name: "Ajustes", href: "/dashboard/ajustes", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname(); // Hook para saber la URL actual
  const router = useRouter();     // Hook para redirigir al salir

  const handleLogout = () => {
    // 1. Borrar sesión del navegador
    localStorage.removeItem("usuario_gasalert");
    // 2. Redirigir al login
    router.push("/");
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen sticky top-0">
      {/* 1. Logo en el Sidebar */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <Image 
            src="/gasalert-logo.png" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="w-10 h-10 object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <span className="text-xl font-bold text-slate-800">GasAlert</span>
      </div>

      {/* 2. Navegación */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href; // ¿Estamos en esta página?

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                size={20}
                className={
                  isActive
                    ? "text-blue-600"
                    : "text-slate-400 group-hover:text-blue-500"
                }
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. Botón Salir */}
      <div className="p-4 border-t border-slate-100">
        <button 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}