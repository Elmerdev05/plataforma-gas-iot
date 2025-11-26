"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";


const MQTT_BROKER = "wss://broker.emqx.io:8084/mqtt";
const TOPIC_BASE = "gasalert/sensores"; // El tema base

export interface SensorData {
  id: string;
  ubicacion: string;
  nivel: number;
  estado: "seguro" | "peligro" | "advertencia";
  bateria: number;
}

export default function useMqtt() {
  const [sensores, setSensores] = useState<SensorData[]>([]);
  const [status, setStatus] = useState<
    "Conectado" | "Desconectado" | "Conectando"
  >("Conectando");

  useEffect(() => {
    console.log("Intentando conectar a MQTT...");

    // 1. Conexión
    const client = mqtt.connect(MQTT_BROKER, {
      clientId: `gasalert_web_${Math.random().toString(16).substring(2, 8)}`,
      keepalive: 60,
    });

    client.on("connect", () => {
      console.log(" Conectado al Broker MQTT");
      setStatus("Conectado");

      client.subscribe(`${TOPIC_BASE}/#`, (err) => {
        if (!err) console.log(`📡 Suscrito a ${TOPIC_BASE}/#`);
      });
    });

    client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        console.log(" Mensaje recibido:", payload);

        setSensores((prev) => {
          const index = prev.findIndex((s) => s.id === payload.id);

          if (index >= 0) {
            const newSensores = [...prev];
            newSensores[index] = { ...newSensores[index], ...payload };
            return newSensores;
          } else {
            return [...prev, payload];
          }
        });
      } catch (error) {
        console.error("Error al procesar mensaje MQTT:", error);
      }
    });

    client.on("error", (err) => {
      console.error("❌ Error MQTT:", err);
      setStatus("Desconectado");
    });

    return () => {
      if (client) client.end();
    };
  }, []);

  return { sensores, status };
}
