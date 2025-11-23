import React from "react";
import SensorCard from "@/components/dashboard/SensorCard";
import FadeIn from "@/components/ui/FadeIn";

const sensores = [
  {
    id: 1,
    ubicacion: "Cocina Principal",
    nivel: 120,
    estado: "seguro",
    bateria: 98,
  },
  {
    id: 2,
    ubicacion: "Sótano / Caldera",
    nivel: 850,
    estado: "peligro",
    bateria: 45,
  },
  {
    id: 3,
    ubicacion: "Garaje",
    nivel: 310,
    estado: "advertencia",
    bateria: 72,
  },
  {
    id: 4,
    ubicacion: "Habitación Bebé",
    nivel: 50,
    estado: "seguro",
    bateria: 100,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-brand-900 mb-2 md:mb-1">
        Resumen de Seguridad
      </h1>
      <p className="text-slate-500 mb-8">
        Monitoreo de sensores en tiempo real
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sensores.map((sensor, index) => (
          <FadeIn key={sensor.id} delay={index * 100}>
            <SensorCard
              ubicacion={sensor.ubicacion}
              nivel={sensor.nivel}
              estado={sensor.estado as "seguro" | "peligro" | "advertencia"}
              bateria={sensor.bateria}
            />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
