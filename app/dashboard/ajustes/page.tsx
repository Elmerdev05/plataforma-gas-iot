"use client";

import React from "react";
import FadeIn from "@/components/ui/FadeIn";
import { Settings, User, Bell, Shield } from "lucide-react";

export default function AjustesPage() {
  const usuario = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("usuario_gasalert") || "{}") : {};

  return (
    <FadeIn>
      <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2 mb-8">
        <Settings size={30} className="text-slate-600" />
        Ajustes
      </h1>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Sección Perfil */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={32} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">{usuario.nombre || "Usuario"}</h2>
                <p className="text-slate-500">{usuario.email || "correo@ejemplo.com"}</p>
            </div>
        </div>

        {/* Opciones (Placeholder) */}
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                    <Bell className="text-slate-400" />
                    <div>
                        <p className="font-medium text-slate-700">Notificaciones de Sonido</p>
                        <p className="text-xs text-slate-400">Activar alarma en este dispositivo</p>
                    </div>
                </div>
                <div className="h-6 w-11 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl opacity-50">
                <div className="flex items-center gap-3">
                    <Shield className="text-slate-400" />
                    <div>
                        <p className="font-medium text-slate-700">Cambiar Contraseña</p>
                        <p className="text-xs text-slate-400">Próximamente</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </FadeIn>
  );
}