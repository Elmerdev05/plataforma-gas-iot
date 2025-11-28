import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string; // En producción esto se encripta, por ahora lo usaremos simple para aprender
  nombre: string;
  fechaRegistro: Date;
}

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: [true, "El email es obligatorio"], 
    unique: true 
  },
  password: { 
    type: String, 
    required: [true, "La contraseña es obligatoria"],
    select: false // Por seguridad, no devolvemos la contraseña al hacer consultas
  },
  nombre: { 
    type: String, 
    required: true 
  },
  fechaRegistro: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);