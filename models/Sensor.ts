import mongoose, { Schema, Document } from "mongoose";

export interface ISensor extends Document {
  macAddress: string;
  nombre: string;
  usuarioId: string;
  fechaRegistro: Date;
}

const SensorSchema: Schema = new Schema<ISensor>({
  macAddress: {
    type: String,
    required: [true, "La MAC es obligatoria"],
    unique: true, // No puede haber dos sensores con la misma MAC
    trim: true,
    uppercase: true,
  },
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  usuarioId: {
    type: String,
    required: true,
    default: "usuario_demo", // Por ahora usaremos un usuario fijo
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Sensor ||
  mongoose.model<ISensor>("Sensor", SensorSchema);
