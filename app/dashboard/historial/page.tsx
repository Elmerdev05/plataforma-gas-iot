"use client";

import React, { useEffect, useState } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { History, AlertTriangle, Calendar, Clock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RegistroHistorial {
  _id: string;
  sensor: string;
  nivel: number;
  createdAt: string; // Viene de la DB como string ISO
}

export default function HistorialPage() {
  const router = useRouter();
  const [registros, setRegistros] = useState<RegistroHistorial[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      // 1. Obtener usuario
      const usuarioString = localStorage.getItem("usuario_gasalert");
      if (!usuarioString) {
        router.push("/");
        return;
      }
      const usuario = JSON.parse(usuarioString);

      try {
        // 2. Fetch a la API real
        const res = await fetch(`/api/historial?userId=${usuario._id}`);
        if (res.ok) {
          const data = await res.json();
          setRegistros(data);
        }
      } catch (error) {
        console.error("Error cargando historial:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, [router]);

  // Función auxiliar para formatear fecha y hora
  const formatearFecha = (isoString: string) => {
    const fecha = new Date(isoString);
    return {
      fecha: fecha.toLocaleDateString(),
      hora: fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FadeIn>
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <History size={30} className="text-brand-600" />
          Historial de Alertas
        </h1>

        {cargando ? (
           <div className="py-20 text-center">
             <Loader2 className="animate-spin text-brand-600 mx-auto mb-2" size={32} />
             <p className="text-slate-400">Cargando registros...</p>
           </div>
        ) : registros.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <AlertTriangle className="mx-auto text-slate-300" size={48} />
            <p className="text-slate-500 mt-4">Aún no hay alertas registradas.</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 border-b">
                  <th className="py-2 px-4">Sensor</th>
                  <th className="py-2 px-4">
                    <div className="flex items-center gap-1"><Calendar size={14} /> Fecha</div>
                  </th>
                  <th className="py-2 px-4">
                    <div className="flex items-center gap-1"><Clock size={14} /> Hora</div>
                  </th>
                  <th className="py-2 px-4 text-right">Nivel Detectado</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((r) => {
                  const { fecha, hora } = formatearFecha(r.createdAt);
                  return (
                    <tr key={r._id} className="border-b last:border-none hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-slate-700">{r.sensor}</td>
                      <td className="py-4 px-4 text-slate-500">{fecha}</td>
                      <td className="py-4 px-4 text-slate-500">{hora}</td>
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full font-bold text-xs ${
                            r.nivel > 400
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {r.nivel} ppm
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </FadeIn>
    </div>
  );
}