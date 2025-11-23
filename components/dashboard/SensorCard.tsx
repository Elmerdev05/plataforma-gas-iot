import React from "react";
import { Wind, Activity } from "lucide-react";

interface SensorCardProps {
  ubicacion: string;
  nivel: number;
  estado: "seguro" | "peligro" | "advertencia";
  bateria?: number;
}

export default function SensorCard({
  ubicacion,
  nivel,
  estado,
  bateria = 100,
}: SensorCardProps) {
  const isDanger = estado === "peligro";
  const isWarning = estado === "advertencia";

  let bgIcon, textIcon, borderColor, shadowColor, textColor;

  if (isDanger) {
    bgIcon = "bg-red-100";
    textIcon = "text-red-600";
    borderColor = "border-red-200";
    shadowColor = "shadow-red-100";
    textColor = "text-red-700";
  } else if (isWarning) {
    bgIcon = "bg-orange-100";
    textIcon = "text-orange-600";
    borderColor = "border-orange-200";
    shadowColor = "shadow-orange-100";
    textColor = "text-orange-700";
  } else {
    bgIcon = "bg-brand-50";
    textIcon = "text-brand-500";
    borderColor = "border-slate-100";
    shadowColor = "shadow-brand-50";
    textColor = "text-brand-900";
  }

  return (
    <div
      className={`relative bg-white p-5 rounded-3xl border ${borderColor} shadow-lg ${shadowColor} transition-transform hover:-translate-y-1 duration-300`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${bgIcon} ${textIcon}`}>
          <Wind size={24} strokeWidth={2.5} />
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold uppercase ${textIcon}`}>
            {estado}
          </span>
          <span className={`relative flex h-3 w-3`}>
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isDanger ? "bg-red-400" : "bg-green-400"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isDanger ? "bg-red-500" : "bg-green-500"
              }`}
            ></span>
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">Ubicación</h3>
        <p className={`text-lg font-bold ${textColor}`}>{ubicacion}</p>
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-3xl font-bold text-slate-800">{nivel}</span>
          <span className="text-xs text-slate-400 mb-1">ppm (Partículas)</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isDanger ? "bg-red-500" : "bg-brand-500"
            }`}
            style={{ width: `${(nivel / 1000) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs">
        <Activity size={14} />
        <span>Batería: {bateria}%</span>
      </div>
    </div>
  );
}
