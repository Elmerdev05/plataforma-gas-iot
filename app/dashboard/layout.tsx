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
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-center md:hidden sticky top-0 z-40 shadow-sm">
          <Image
            src="/gasalert-logo.png"
            alt="Logo GasAlert"
            width={32}
            height={32}
            className="mr-2"
          />
          <span className="text-lg font-bold text-brand-900">GasAlert</span>
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
