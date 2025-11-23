"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, Settings, LogOut } from "lucide-react";

const menuItems = [
  { name: "Panel", href: "/dashboard", icon: LayoutDashboard },
  { name: "Historial", href: "/dashboard/historial", icon: History },
  { name: "Ajustes", href: "/dashboard/ajustes", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-slate-200 md:hidden pb-safe">
      <nav className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive
                  ? "text-brand-600"
                  : "text-slate-400 hover:text-brand-500"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">{item.name}</span>
            </Link>
          );
        })}
        <button className="flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-danger">
            <LogOut size={24} />
            <span className="text-[10px] font-medium mt-1">Salir</span>
        </button>
      </nav>
    </div>
  );
}