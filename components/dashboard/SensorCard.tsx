import React from "react";
import { Wind, Activity, Battery, Signal } from "lucide-react";

interface SensorCardProps {
  ubicacion: string;
  nivel: number;
  estado: "seguro" | "peligro" | "advertencia";
  bateria?: number;
}

export default function SensorCard({ ubicacion, nivel, estado, bateria = 100 }: SensorCardProps) {
  const isDanger = estado === "peligro";
  const isWarning = estado === "advertencia";
  
  // Colores Dinámicos (Sutiles y Elegantes)
  let headerBg, iconColor, statusText, ringColor, barColor;

  if (isDanger) {
    headerBg = "bg-gradient-to-r from-red-50 to-white";
    iconColor = "text-red-500";
    statusText = "text-red-600";
    ringColor = "ring-red-100";
    barColor = "bg-red-500";
  } else if (isWarning) {
    headerBg = "bg-gradient-to-r from-orange-50 to-white";
    iconColor = "text-orange-500";
    statusText = "text-orange-600";
    ringColor = "ring-orange-100";
    barColor = "bg-orange-500";
  } else {
    headerBg = "bg-gradient-to-r from-blue-50 to-white";
    iconColor = "text-blue-500";
    statusText = "text-blue-600";
    ringColor = "ring-blue-100";
    barColor = "bg-blue-500";
  }

  return (
    <div className={`relative bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
      
      {/* Header de Color Suave */}
      <div className={`px-6 py-5 flex justify-between items-center ${headerBg} border-b border-slate-50`}>
        <div className={`p-2.5 bg-white rounded-2xl shadow-sm ${iconColor} ring-4 ${ringColor}`}>
          <Wind size={22} strokeWidth={2.5} />
        </div>
        
        <div className="flex items-center gap-2">
           <span className={`text-[10px] font-bold tracking-wider uppercase ${statusText} bg-white/80 px-2 py-1 rounded-full shadow-sm border border-slate-100`}>
             {estado}
           </span>
           {/* Indicador de pulso */}
           <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDanger ? 'bg-red-400' : isWarning ? 'bg-orange-400' : 'bg-blue-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isDanger ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
            </span>
        </div>
      </div>

      {/* Cuerpo de la Tarjeta */}
      <div className="p-6">
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Ubicación</h3>
        <p className="text-lg font-bold text-slate-800 leading-tight mb-6">{ubicacion}</p>

        {/* El Número Grande */}
        <div className="flex items-baseline gap-1 mb-4">
            <span className={`text-5xl font-black tracking-tighter ${statusText}`}>
                {nivel}
            </span>
            <span className="text-sm font-medium text-slate-400">ppm</span>
        </div>
         
        {/* Barra de Progreso Moderna */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
              style={{ width: `${Math.min((nivel / 1000) * 100, 100)}%` }} 
            ></div>
        </div>

        {/* Footer con Detalles */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-50 text-slate-400">
            <div className="flex items-center gap-1.5 text-xs font-medium">
                <Battery size={14} className={bateria < 20 ? "text-red-500" : "text-green-500"} />
                <span>{bateria}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium">
                <Signal size={14} className="text-blue-400" />
                <span>WiFi</span>
            </div>
        </div>
      </div>
    </div>
  );
}