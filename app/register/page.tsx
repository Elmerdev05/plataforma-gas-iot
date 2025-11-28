"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("¡Cuenta creada! Ahora inicia sesión.");
      router.push("/"); // Volver al Login
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Crear Cuenta</h2>
          <p className="text-slate-500">Únete a GasAlert</p>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre Completo"
            required
            className="w-full p-3 border border-slate-200 rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            required
            className="w-full p-3 border border-slate-200 rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            className="w-full p-3 border border-slate-200 rounded-xl"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl"
          >
            Registrarse
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-blue-600">
            Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
}
