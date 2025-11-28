"use client";

import React, { useState } from "react";
import { QrCode, Router, CheckCircle2, ArrowRight } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { useRouter } from "next/navigation";

export default function AgregarSensorPagina() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [serialId, setSerialId] = useState("");
  const [nombre, setNombre] = useState("");

  const handleVincular = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. OBTENER EL USUARIO DEL LOCALSTORAGE
    const usuarioString = localStorage.getItem("usuario_gasalert");

    if (!usuarioString) {
      alert(
        "No se encontró sesión activa. Por favor inicia sesión nuevamente."
      );
      router.push("/");
      return;
    }

    const usuario = JSON.parse(usuarioString);

    try {
      const respuesta = await fetch("/api/sensores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          macAddress: serialId,
          nombre: nombre,
          userId: usuario._id, // <--- ¡ESTO ES LO QUE FALTABA!
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // Muestra el mensaje específico del error que viene del backend
        alert(datos.message || datos.error || "Error al guardar el sensor");
        return;
      }

      alert(`¡Sensor vinculado en la Nube con éxito! `);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-brand-900">
          Agregar Nuevo Dispositivo
        </h1>
        <p className="text-slate-500">
          Sigue los pasos para configurar tu sensor GasAlert
        </p>
      </header>

      <FadeIn className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 text-brand-600 rounded-full flex items-center justify-center shrink-0">
                <Router size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">
                  Paso 1: Conecta el Sensor al WiFi
                </h3>
                <p className="text-sm text-slate-500">
                  Antes de vincularlo aquí, asegúrate de que el sensor tenga
                  internet.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 space-y-2 border border-slate-200">
              <p>1. Enchufa tu sensor GasAlert.</p>
              <p>
                2. Busca la red WiFi <strong>GasAlert_Setup</strong> en tu
                celular.
              </p>
              <p>
                3. Conéctate y sigue las instrucciones para darle acceso a tu
                WiFi de casa.
              </p>
              <p>4. Cuando la luz del sensor deje de parpadear, vuelve aquí.</p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Ya está conectado, continuar <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleVincular} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 text-brand-600 rounded-full flex items-center justify-center shrink-0">
                <QrCode size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">
                  Paso 2: Registra el Dispositivo
                </h3>
                <p className="text-sm text-slate-500">
                  Ingresa el código único que viene detrás del sensor.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                ID del Sensor (Serial Number)
              </label>
              <input
                type="text"
                required
                placeholder="Ej: A1:B2:C3..."
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none uppercase font-mono"
                value={serialId}
                onChange={(e) => setSerialId(e.target.value.toUpperCase())}
              />
              <p className="text-xs text-slate-400 mt-1">
                Lo encontrarás en la etiqueta trasera.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ponle un nombre (Ubicación)
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Cocina Principal"
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 text-slate-500 hover:bg-slate-50 font-bold rounded-xl transition-colors"
              >
                Atrás
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} /> Vincular Ahora
              </button>
            </div>
          </form>
        )}
      </FadeIn>
    </div>
  );
}
