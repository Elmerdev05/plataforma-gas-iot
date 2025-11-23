"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-brand-100">
        <div className="text-center mb-8">
          <Image
            src="/gasalert-logo.png"
            alt="GasAlert Logo"
            width={120}
            height={140}
            className="mx-auto mb-4 object-contain"
            priority
          />

          <h2 className="text-3xl font-bold text-brand-900">Bienvenido</h2>
          <p className="text-slate-500 mt-2">Sistema de GasAlert</p>
        </div>

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
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
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
                className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-brand-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <a
              href="#"
              className="text-sm font-medium text-brand-600 hover:text-brand-500"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/30"
          >
            Acceder al Panel
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          ¿Nuevo usuario?{" "}
          <a
            href="#"
            className="font-medium text-brand-600 hover:text-brand-500"
          >
            Crear cuenta
          </a>
        </div>
      </div>
    </div>
  );
}
