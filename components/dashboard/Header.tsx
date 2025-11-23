"use client";

import React, { useState } from "react";
import { Bell, UserCircle2 } from "lucide-react";

export default function Header() {
  const [notifications, setNotifications] = useState(true);

  return (
    <header className="hidden md:flex justify-between items-center mb-8 p-6 bg-white rounded-xl shadow-sm border border-slate-100 sticky top-8 z-30">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Bienvenido, Usuario!
        </h2>
        <p className="text-slate-500 text-sm">
          Monitoreo activo de tus sensores.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 bg-slate-50 rounded-full text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition-colors">
          <Bell size={20} />
          {notifications && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full animate-pulse"></span>
          )}
        </button>

        <button className="flex items-center gap-2 p-2 bg-slate-50 rounded-full text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition-colors">
          <UserCircle2 size={24} strokeWidth={1.5} />
          <span className="text-sm font-medium hidden lg:block">Perfil</span>
        </button>
      </div>
    </header>
  );
}
