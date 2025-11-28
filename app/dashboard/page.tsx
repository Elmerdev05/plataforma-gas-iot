"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Cloud, CloudOff, Volume2, VolumeX } from "lucide-react";
import SensorCard from "@/components/dashboard/SensorCard";
import FadeIn from "@/components/ui/FadeIn";
import useMqtt from "@/hooks/useMqtt";

interface DispositivoGuardado {
  _id: string;
  macAddress: string;
  nombre: string;
  usuarioId?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { sensores, status } = useMqtt();
  const [misDispositivos, setMisDispositivos] = useState<DispositivoGuardado[]>([]);
  const [cargandoDB, setCargandoDB] = useState(true);
  
  // Preferencia de sonido
  const [sonidoActivo, setSonidoActivo] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ultimoAviso = useRef<number>(0);

  // 1. CARGAR PREFERENCIA DE SONIDO
  useEffect(() => {
    const preferenciaSilencio = localStorage.getItem("gasalert_silencio");
    if (preferenciaSilencio === "true") {
      setSonidoActivo(false);
    }
    audioRef.current = new Audio("/alarm.mp3");
  }, []);

  // 2. GESTIONAR AUDIO
  useEffect(() => {
    if (!sonidoActivo && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      localStorage.setItem("gasalert_silencio", "true");
    } else {
      localStorage.removeItem("gasalert_silencio");
    }
  }, [sonidoActivo]);

  // 3. CARGAR DISPOSITIVOS DEL USUARIO
  useEffect(() => {
    const usuarioString = localStorage.getItem("usuario_gasalert");

    if (!usuarioString) {
      router.push("/");
      return;
    }

    const usuario = JSON.parse(usuarioString);

    const cargarSensoresCloud = async () => {
      try {
        const res = await fetch(`/api/sensores?userId=${usuario._id}`);
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

    if (typeof window !== "undefined" && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, [router]);

  // 4. LÓGICA DE ALARMAS E HISTORIAL (CORREGIDO)
  useEffect(() => {
    // Buscamos si hay algún sensor con nivel peligroso
    const sensorPeligrosoRaw = sensores.find((s) => s.nivel > 400);

    if (sensorPeligrosoRaw) {
      const ahora = Date.now();
      const tiempoPasado = ahora - ultimoAviso.current;

      // Ejecutar solo si han pasado 60 segundos desde la última alerta
      if (tiempoPasado > 60000) { 
        
        // CORRECCIÓN IMPORTANTE: 
        // Buscamos el nombre real del sensor en 'misDispositivos' usando la MAC Address
        const infoSensor = misDispositivos.find(d => d.macAddress === sensorPeligrosoRaw.id);
        const nombreUbicacion = infoSensor?.nombre || "Sensor Desconocido";

        // A) SONIDO
        if (sonidoActivo && audioRef.current) {
          audioRef.current.play().catch((e) => console.log("Audio bloqueado:", e));
        }

        // B) NOTIFICACIÓN NAVEGADOR
        if (Notification.permission === "granted") {
          new Notification("¡PELIGRO DE GAS!", {
            body: `Nivel crítico en: ${nombreUbicacion}`,
            icon: "/gasalert-logo.png",
          });
        }

        const usuarioString = localStorage.getItem("usuario_gasalert");
        const usuario = usuarioString ? JSON.parse(usuarioString) : null;

        if (usuario) {
            // C) ENVIAR EMAIL
            fetch("/api/alerta-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sensor: nombreUbicacion, // Usamos el nombre corregido
                    valor: sensorPeligrosoRaw.nivel,
                    emailDestino: usuario.email,
                }),
            }).catch((err) => console.error("Error enviando email:", err));

            // D) GUARDAR EN HISTORIAL (CONECTADO A LA DB)
            fetch("/api/historial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuarioId: usuario._id,
                    sensor: nombreUbicacion, // Usamos el nombre corregido
                    nivel: sensorPeligrosoRaw.nivel,
                }),
            }).then(() => console.log("Alerta guardada en historial"))
              .catch((err) => console.error("Error guardando historial:", err));
        }

        ultimoAviso.current = ahora;
      }
    }
    // Agregamos misDispositivos a las dependencias para que el nombre se actualice si cambia
  }, [sensores, sonidoActivo, misDispositivos]); 

  // Mapeo para visualización (cards)
  const sensoresVisibles = sensores
    .filter((mqttSensor) =>
      misDispositivos.some((dbSensor) => dbSensor.macAddress === mqttSensor.id)
    )
    .map((mqttSensor) => {
      const infoDB = misDispositivos.find(
        (d) => d.macAddress === mqttSensor.id
      );
      return { ...mqttSensor, ubicacion: infoDB?.nombre || "Desconocido" };
    });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">
            Resumen de Seguridad
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              <Cloud
                size={14}
                className={
                  cargandoDB ? "animate-bounce text-blue-500" : "text-slate-400"
                }
              />
              {cargandoDB ? "Sincronizando..." : "Nube OK"}
            </span>
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm ${
                status === "Conectado"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status === "Conectado"
                    ? "bg-green-500"
                    : "bg-red-500 animate-pulse"
                }`}
              ></span>
              MQTT: {status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setSonidoActivo(!sonidoActivo)}
            className={`p-3 rounded-xl border transition-all ${
              sonidoActivo
                ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                : "bg-red-100 border-red-200 text-red-600"
            }`}
          >
            {sonidoActivo ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <Link
            href="/dashboard/agregar"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={20} />
            <span>Nuevo</span>
          </Link>
        </div>
      </div>

      {cargandoDB && misDispositivos.length === 0 && (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando tus dispositivos...</p>
        </div>
      )}

      {!cargandoDB && misDispositivos.length === 0 && (
        <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm mx-auto max-w-lg">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
            <Plus size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Aún no tienes sensores
          </h3>
          <p className="text-slate-500 mb-6">
            Vincula tu primer dispositivo GasAlert para comenzar.
          </p>
          <Link
            href="/dashboard/agregar"
            className="text-blue-600 font-bold hover:underline"
          >
            Vincular ahora &rarr;
          </Link>
        </div>
      )}

      {!cargandoDB &&
        misDispositivos.length > 0 &&
        sensoresVisibles.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/50">
            <CloudOff size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-600 font-medium text-lg">
              Sensores sin conexión
            </p>
            <p className="text-sm text-slate-400 mt-1 mb-4">
              Tienes {misDispositivos.length} sensor(es) registrado(s), pero no
              recibimos señal.
            </p>
            <p className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full inline-block">
              Sugerencia: Revisa que tu ESP32 esté encendido
            </p>
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sensoresVisibles.map((sensor, index) => (
          <FadeIn key={sensor.id} delay={index * 100}>
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