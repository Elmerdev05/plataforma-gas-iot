"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, CloudOff, Cloud } from "lucide-react";
import SensorCard from "@/components/dashboard/SensorCard";
import FadeIn from "@/components/ui/FadeIn";
import useMqtt from "@/hooks/useMqtt";

export default function DashboardPage() {
  const { sensores, status } = useMqtt();
  const [misDispositivos, setMisDispositivos] = useState<any[]>([]);
  const [cargandoDB, setCargandoDB] = useState(true);

  useEffect(() => {
    const cargarSensoresCloud = async () => {
      try {
        const res = await fetch("/api/sensores");
        if (res.ok) {
          const data = await res.json();
          setMisDispositivos(data);
        }
      } catch (error) {
        console.error("Error cargando sensores:", error);
      } finally {
        setCargandoDB(false);
      }
    };

    cargarSensoresCloud();
  }, []);

  const sensoresVisibles = sensores
    .filter((mqttSensor) =>
      misDispositivos.some((dbSensor) => dbSensor.macAddress === mqttSensor.id)
    )
    .map((mqttSensor) => {
      const infoDB = misDispositivos.find(
        (d) => d.macAddress === mqttSensor.id
      );
      return { ...mqttSensor, ubicacion: infoDB.nombre };
    });

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-900 mb-1">
            Resumen de Seguridad
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-slate-500">
              <Cloud
                size={16}
                className={
                  cargandoDB
                    ? "animate-bounce text-brand-500"
                    : "text-slate-400"
                }
              />
              {cargandoDB ? "Sincronizando..." : "Nube Sincronizada"}
            </span>
            <span
              className={`font-bold ${
                status === "Conectado" ? "text-green-500" : "text-orange-500"
              }`}
            >
              MQTT: {status}
            </span>
          </div>
        </div>

        <Link
          href="/dashboard/agregar"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm shadow-brand-200"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Nuevo</span>
        </Link>
      </div>

      {cargandoDB && misDispositivos.length === 0 && (
        <div className="p-10 text-center">
          <p className="text-slate-400">Cargando tus dispositivos...</p>
        </div>
      )}

      {!cargandoDB && misDispositivos.length === 0 && (
        <div className="text-center p-10 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-lg font-bold text-slate-700">
            Aún no tienes sensores
          </p>
          <p className="text-slate-400 mb-4">
            Vincula tu primer dispositivo para ver datos.
          </p>
        </div>
      )}

      {!cargandoDB &&
        misDispositivos.length > 0 &&
        sensoresVisibles.length === 0 && (
          <div className="text-center p-10 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <CloudOff size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">
              Tus sensores están vinculados pero desconectados
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Tienes {misDispositivos.length} sensor(es) registrado(s). Enciende
              tu ESP32.
            </p>
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sensoresVisibles.map((sensor, index) => (
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
