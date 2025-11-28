import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    // 1. Conectar a la Base de Datos
    await connectDB();

    // 2. Leer lo que manda el usuario
    const { email, password } = await request.json();

    // 3. Buscar al usuario por email (y pedir explícitamente la contraseña oculta)
    const user = await User.findOne({ email }).select("+password");

    // Si no existe el usuario
    if (!user) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 400 }
      );
    }

    // 4. Comparar contraseñas (Simple por ahora)
    const isMatch = user.password === password;

    if (!isMatch) {
      return NextResponse.json(
        { message: "Contraseña incorrecta" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error en el servidor" },
      { status: 500 }
    );
  }
}
