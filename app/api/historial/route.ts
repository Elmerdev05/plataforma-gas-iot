import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Alerta from "@/models/Alerta";

// GET: Obtener el historial de un usuario
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json([], { status: 400 });
    }

    // Buscamos las alertas del usuario y las ordenamos por fecha (más nuevas primero)
    const alertas = await Alerta.find({ usuarioId: userId }).sort({ createdAt: -1 });

    return NextResponse.json(alertas);
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    return NextResponse.json({ error: "Error al obtener historial" }, { status: 500 });
  }
}

// POST: Guardar una nueva alerta (Llama a esto desde tu Dashboard cuando suene la alarma)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const nuevaAlerta = await Alerta.create(body);

    return NextResponse.json(nuevaAlerta, { status: 201 });
  } catch (error) {
    console.error("Error guardando alerta:", error);
    return NextResponse.json({ error: "Error al guardar alerta" }, { status: 500 });
  }
}