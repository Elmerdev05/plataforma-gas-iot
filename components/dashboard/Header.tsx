"use client";

import React, { useState, useEffect } from "react";
import { Bell, UserCircle2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

// 1. Definimos la forma que debe tener el usuario
interface UsuarioGuardado {
  nombre: string;
  email: string;
}

export default function Header() {
  const router = useRouter();

  // 2. Le decimos al estado que usaremos esa forma
  const [usuario, setUsuario] = useState<UsuarioGuardado>({
    nombre: "Usuario",
    email: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("usuario_gasalert");

    if (data) {
      try {
        const parsedUser = JSON.parse(data) as UsuarioGuardado;

        setTimeout(() => {
          setUsuario(parsedUser);
        }, 0);
      } catch (error) {
        console.error("Error al leer usuario:", error);
        localStorage.removeItem("usuario_gasalert");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario_gasalert");
    // Borramos también la cookie de seguridad
    document.cookie =
      "gasalert_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/");
  };

  return (
    <header className="flex justify-between items-center mb-8 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-slate-100 sticky top-4 z-30">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Hola,{" "}
          <span className="text-blue-600">{usuario.nombre.split(" ")[0]}</span>{" "}
          👋
        </h2>
        <p className="text-slate-400 text-xs md:text-sm">
          Todo bajo control hoy.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2.5 bg-slate-50 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-700">{usuario.nombre}</p>
          
          </div>

          <button
            onClick={handleLogout}
            className="p-1 bg-slate-100 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
