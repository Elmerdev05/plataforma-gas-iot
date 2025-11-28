"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ✅ 2. Nuevo estado para controlar la carga
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setIsLoading(false);
        return;
      }
      localStorage.setItem("usuario_gasalert", JSON.stringify(data));

      document.cookie = `gasalert_session=true; path=/; max-age=86400; SameSite=Lax`;

      console.log("Bienvenido:", data.nombre);

      // Redirección
      router.push("/dashboard");
      // --------------------
    } catch (err) {
      setError("Error de conexión con el servidor");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <Image
            src="/gasalert-logo.png"
            alt="GasAlert Logo"
            width={100}
            height={100}
            className="mx-auto mb-4 object-contain"
            priority
          />
          <h2 className="text-3xl font-bold text-slate-900">Bienvenido</h2>
          <p className="text-slate-500 mt-2">Sistema de GasAlert</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded-lg text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                disabled={isLoading} // Deshabilitamos si está cargando
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading} // Deshabilitamos si está cargando
                className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-600 disabled:hover:text-slate-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* ✅ 3. Botón modificado con estado de carga */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <>
                {/* Icono giratorio */}
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Accediendo...
              </>
            ) : (
              "Acceder al Panel"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          ¿Nuevo usuario?{" "}
          <a
            href="/register"
            className={`font-medium text-blue-600 hover:text-blue-500 ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Crear cuenta
          </a>
        </div>
      </div>
    </div>
  );
}
