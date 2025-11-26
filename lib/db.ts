import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Error Crítico: No se encontró la variable MONGODB_URI en .env.local"
  );
}

// Sistema de Caché para Next.js (evita saturar conexiones)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Si ya hay conexión, úsala
  if (cached.conn) {
    return cached.conn;
  }

  // Si no, crea una nueva
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Intentando conectar a MongoDB...");
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("¡Conectado a MongoDB con éxito!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Error conectando a DB:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;