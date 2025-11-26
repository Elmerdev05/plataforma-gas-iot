import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";
import Header from "@/components/dashboard/Header";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between md:hidden sticky top-0 z-40">
          {/* Lado Izquierdo: Logo */}
          <div className="flex items-center gap-2">
            <Image src="/gasalert-logo.png" alt="Logo" width={32} height={32} />
            <span className="text-lg font-bold text-brand-900">GasAlert</span>
          </div>

          {/* Lado Derecho: Perfil de Usuario (Nuevo) */}
          <button className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition-colors">
            {/* Usamos un icono de usuario genérico por ahora */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </header>

        <div className="hidden md:block md:px-8 md:pt-8 flex-none">
          <Header />
        </div>
        <main className="flex-1 p-4 md:px-8 overflow-y-auto pb-24 md:pb-8 pt-4 md:pt-0">
          {children}
        </main>

        <MobileNav />
      </div>
    </div>
  );
}
