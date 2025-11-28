import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sensor from "@/models/Sensor"; // Asegúrate de tener este modelo creado

export async function POST(request: Request) {
  try {
    await connectDB();
    
    // 1. Recibimos los datos, INCLUYENDO el userId
    const { macAddress, nombre, userId } = await request.json();

    // 2. Validaciones básicas
    if (!macAddress || !nombre) {
      return NextResponse.json(
        { message: "Faltan datos (Mac Address o Nombre)" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "No se identificó al usuario propietario" },
        { status: 400 }
      );
    }

    // 3. Verificar si ese sensor ya existe (opcional, para evitar duplicados)
    const sensorExistente = await Sensor.findOne({ macAddress });
    if (sensorExistente) {
      return NextResponse.json(
        { message: "Este sensor ya está registrado en el sistema" },
        { status: 400 }
      );
    }

    // 4. Crear el sensor vinculado al usuario
    const nuevoSensor = await Sensor.create({
      macAddress,
      nombre,
      usuarioId: userId, // Guardamos la referencia al usuario
      // Si tu modelo usa 'usuario' en vez de 'usuarioId', cámbialo aquí
    });

    return NextResponse.json(nuevoSensor, { status: 201 });

  } catch (error) {
    console.error("Error al crear sensor:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// También necesitamos el GET para que el Dashboard cargue los sensores
export async function GET(request: Request) {
  try {
    await connectDB();

    // Obtener el userId de la URL (ej: /api/sensores?userId=123...)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json([], { status: 400 });
    }

    // Buscar solo los sensores de ese usuario
    const sensores = await Sensor.find({ usuarioId: userId });

    return NextResponse.json(sensores);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error al obtener sensores" },
      { status: 500 }
    );
  }
}