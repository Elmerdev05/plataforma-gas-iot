import mongoose, { Schema, model, models } from "mongoose";

const AlertaSchema = new Schema(
  {
    usuarioId: {
      type: String,
      required: true,
    },
    sensor: {
      type: String, 
      required: true, // Ej: "Cocina"
    },
    nivel: {
      type: Number,
      required: true, // Ej: 450
    },
    // MongoDB guarda la fecha de creación automáticamente con timestamps
  },
  { timestamps: true }
);

const Alerta = models.Alerta || model("Alerta", AlertaSchema);

export default Alerta;