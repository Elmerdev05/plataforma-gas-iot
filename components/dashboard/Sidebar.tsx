"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Para saber en qué página estamos
import { LayoutDashboard, History, Settings, LogOut } from "lucide-react";

// Definimos los links del menú
const menuItems = [
  { name: "Panel Principal", href: "/dashboard", icon: LayoutDashboard },
  { name: "Historial", href: "/dashboard/historial", icon: History },
  { name: "Ajustes", href: "/dashboard/ajustes", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname(); // Hook para saber la URL actual

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-screen sticky top-0">
      {/* 1. Logo en el Sidebar */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <Image src="/gasalert-logo.png" alt="Logo" width={40} height={40} />
        <span className="text-xl font-bold text-brand-900">GasAlert</span>
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
                  ? "bg-brand-50 text-brand-600 font-semibold" // Estilo Activo
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900" // Estilo Inactivo
              }`}
            >
              <Icon
                size={20}
                className={
                  isActive
                    ? "text-brand-600"
                    : "text-slate-400 group-hover:text-brand-500"
                }
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. Botón Salir */}
      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 p-3 w-full text-slate-500 hover:text-danger hover:bg-danger-bg rounded-xl transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
