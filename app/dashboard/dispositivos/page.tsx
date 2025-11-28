"use client";

import React, { useEffect, useState } from "react";
import { 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Thermometer, 
  MoreVertical, 
  AlertTriangle 
} from "lucide-react";
import { useRouter } from "next/navigation";
import FadeIn from "@/components/ui/FadeIn";
import Link from "next/link";

interface Dispositivo {
  _id: string;
  macAddress: string;
  nombre: string; // Esto funciona como Alias/Habitación
  usuarioId: string;
}

export default function GestionDispositivosPage() {
  const router = useRouter();
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Estado para Edición
  const [dispositivoEditando, setDispositivoEditando] = useState<Dispositivo | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  
  // Estado para Eliminación
  const [dispositivoAEliminar, setDispositivoAEliminar] = useState<Dispositivo | null>(null);

  // 1. CARGAR DISPOSITIVOS
  const cargarDispositivos = async () => {
    setCargando(true);
    const usuarioString = localStorage.getItem("usuario_gasalert");
    if (!usuarioString) return;
    const usuario = JSON.parse(usuarioString);

    try {
      const res = await fetch(`/api/sensores?userId=${usuario._id}`);
      if (res.ok) {
        const data = await res.json();
        setDispositivos(data);
      }
    } catch (error) {
      console.error("Error cargando dispositivos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDispositivos();
  }, []);

  // 2. FUNCIÓN DE ELIMINAR
  const confirmarEliminacion = async () => {
    if (!dispositivoAEliminar) return;

    try {
      const res = await fetch(`/api/sensores`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: dispositivoAEliminar._id }),
      });

      if (res.ok) {
        setDispositivos(prev => prev.filter(d => d._id !== dispositivoAEliminar._id));
        setDispositivoAEliminar(null); // Cerrar modal
        router.refresh();
      } else {
        alert("No se pudo eliminar el dispositivo");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  // 3. FUNCIÓN DE EDITAR (ACTUALIZAR)
  const guardarCambios = async () => {
    if (!dispositivoEditando) return;

    try {
      const res = await fetch(`/api/sensores`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: dispositivoEditando._id, 
          nombre: nuevoNombre 
        }),
      });

      if (res.ok) {
        // Actualizar lista localmente para que se vea rápido
        setDispositivos(prev => prev.map(d => 
          d._id === dispositivoEditando._id ? { ...d, nombre: nuevoNombre } : d
        ));
        setDispositivoEditando(null); // Cerrar modal
        router.refresh();
      } else {
        alert("Error al actualizar el nombre");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mis Dispositivos</h1>
          <p className="text-slate-500">Administra, edita o elimina tus sensores.</p>
        </div>
        <Link 
            href="/dashboard/agregar" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
            + Agregar Nuevo
        </Link>
      </header>

      {/* LISTA DE DISPOSITIVOS */}
      {cargando ? (
        <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : dispositivos.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 mb-4">No tienes dispositivos registrados.</p>
            <Link href="/dashboard/agregar" className="text-blue-600 font-bold hover:underline">
                Vincular uno ahora
            </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {dispositivos.map((device, idx) => (
            <FadeIn key={device._id} delay={idx * 50}>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Info del Dispositivo */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <Thermometer size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{device.nombre}</h3>
                    <p className="text-sm text-slate-400 font-mono">ID: {device.macAddress}</p>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => {
                        setDispositivoEditando(device);
                        setNuevoNombre(device.nombre);
                    }}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition font-medium text-sm"
                  >
                    <Edit2 size={16} /> Editar
                  </button>
                  
                  <button 
                    onClick={() => setDispositivoAEliminar(device)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {dispositivoEditando && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Editar Dispositivo</h3>
              <button onClick={() => setDispositivoEditando(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre / Habitación</label>
                <input 
                  type="text" 
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: Cocina"
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setDispositivoEditando(null)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl"
                >
                  Cancelar
                </button>
                <button 
                  onClick={guardarCambios}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINAR */}
      {dispositivoAEliminar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">¿Eliminar dispositivo?</h3>
            <p className="text-slate-500 mb-6">
                Estás a punto de eliminar <strong>{dispositivoAEliminar.nombre}</strong>. 
                Esta acción no se puede deshacer y dejarás de recibir alertas de este sensor.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setDispositivoAEliminar(null)}
                className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminacion}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}