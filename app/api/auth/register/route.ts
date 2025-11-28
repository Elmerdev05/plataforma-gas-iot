import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { nombre, email, password } = await request.json();

    // Validar si ya existe
    const userFound = await User.findOne({ email });
    if (userFound) {
      return NextResponse.json({ message: "El correo ya existe" }, { status: 400 });
    }

    // Crear usuario
    const user = new User({ nombre, email, password });
    await user.save();

    return NextResponse.json({ message: "Usuario creado exitosamente" });
  } catch (_error) {
    return NextResponse.json({ message: "Error al registrar" }, { status: 500 });
  }
}