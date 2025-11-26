import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Sensor from "@/models/Sensor";

export async function POST(request: Request) {
  try {
    await connectDB();

    const data = await request.json();
    const { macAddress, nombre } = data;

    if (!macAddress || !nombre) {
      return NextResponse.json(
        { error: "Faltan datos (MAC o Nombre)" },
        { status: 400 }
      );
    }

    const sensorExistente = await Sensor.findOne({ macAddress });
    if (sensorExistente) {
      return NextResponse.json(
        { error: "¡Este sensor ya está registrado en el sistema!" },
        { status: 409 }
      );
    }

    const nuevoSensor = new Sensor({
      macAddress,
      nombre,
      usuarioId: "usuario_demo",
    });

    await nuevoSensor.save();

    console.log(" Sensor guardado en Nube:", nombre);

    return NextResponse.json(
      { message: "Sensor vinculado correctamente", sensor: nuevoSensor },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error al guardar sensor:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const sensores = await Sensor.find({ usuarioId: "usuario_demo" });

    return NextResponse.json(sensores);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al cargar sensores" },
      { status: 500 }
    );
  }
}
