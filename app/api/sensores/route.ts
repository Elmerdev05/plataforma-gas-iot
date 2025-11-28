import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sensor from "@/models/Sensor";

// --- GET: Obtener sensores de un usuario ---
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json([], { status: 400 });
    }

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

// --- POST: Crear nuevo sensor ---
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { macAddress, nombre, userId } = await request.json();

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

    const sensorExistente = await Sensor.findOne({ macAddress });
    if (sensorExistente) {
      return NextResponse.json(
        { message: "Este sensor ya está registrado en el sistema" },
        { status: 400 }
      );
    }

    const nuevoSensor = await Sensor.create({
      macAddress,
      nombre,
      usuarioId: userId,
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

// --- PUT: Editar nombre del sensor ---
export async function PUT(request: Request) {
  try {
    await connectDB();
    
    // Recibimos el ID del sensor y el nuevo nombre
    const { id, nombre } = await request.json();

    if (!id || !nombre) {
      return NextResponse.json(
        { message: "Faltan datos para actualizar" },
        { status: 400 }
      );
    }

    // Buscamos por ID y actualizamos
    const sensorActualizado = await Sensor.findByIdAndUpdate(
      id,
      { nombre }, 
      { new: true } // Esto hace que devuelva el objeto ya modificado
    );

    if (!sensorActualizado) {
      return NextResponse.json(
        { message: "Sensor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(sensorActualizado);

  } catch (error) {
    console.error("Error al actualizar sensor:", error);
    return NextResponse.json(
      { message: "Error interno al actualizar" },
      { status: 500 }
    );
  }
}

// --- DELETE: Eliminar sensor ---
export async function DELETE(request: Request) {
  try {
    await connectDB();

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Falta el ID del sensor" },
        { status: 400 }
      );
    }

    const sensorEliminado = await Sensor.findByIdAndDelete(id);

    if (!sensorEliminado) {
      return NextResponse.json(
        { message: "Sensor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Sensor eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar sensor:", error);
    return NextResponse.json(
      { message: "Error interno al eliminar" },
      { status: 500 }
    );
  }
}