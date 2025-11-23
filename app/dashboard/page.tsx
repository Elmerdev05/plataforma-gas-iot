"use client"; // Importante porque usa hooks

import React from "react";
import SensorCard from "@/components/dashboard/SensorCard";
import FadeIn from "@/components/ui/FadeIn";
import useMqtt from "@/hooks/useMqtt"; // <--- Importamos nuestro hook

export default function DashboardPage() {
  // Usamos el hook para obtener los datos REALES
  const { sensores, status } = useMqtt();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-900 mb-1">
            Resumen de Seguridad
          </h1>
          <p className="text-slate-500">
            Estado de conexión:
            <span
              className={`ml-2 font-bold ${
                status === "Conectado" ? "text-green-500" : "text-red-500"
              }`}
            >
              {status}
            </span>
          </p>
        </div>
      </div>

      {/* Mensaje si no hay sensores aún */}
      {sensores.length === 0 && status === "Conectado" && (
        <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-3xl">
          <p className="text-slate-400">Esperando datos de sensores...</p>
          <p className="text-xs text-slate-300 mt-2">
            Enciende tu ESP32 o ejecuta el simulador
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sensores.map((sensor, index) => (
          <FadeIn key={sensor.id} delay={index * 100}>
            {/* @ts-ignore */}
            <SensorCard
              ubicacion={sensor.ubicacion}
              nivel={sensor.nivel}
              estado={sensor.estado}
              bateria={sensor.bateria}
            />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
