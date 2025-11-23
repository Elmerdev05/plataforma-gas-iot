"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";

// Usaremos un Broker Público para pruebas (luego pondremos el privado)
// Protocolo: wss (WebSocket Secure) porque estamos en web
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
      console.log("✅ Conectado al Broker MQTT");
      setStatus("Conectado");

      // 2. Suscripción: Escuchamos TODO lo que venga de nuestros sensores
      // El '#' es un comodín (wildcard) para escuchar cualquier subtema
      client.subscribe(`${TOPIC_BASE}/#`, (err) => {
        if (!err) console.log(`📡 Suscrito a ${TOPIC_BASE}/#`);
      });
    });

    client.on("message", (topic, message) => {
      // 3. Recepción de mensajes
      try {
        const payload = JSON.parse(message.toString());
        console.log("📩 Mensaje recibido:", payload);

        // Actualizamos el estado de los sensores
        setSensores((prev) => {
          // Buscamos si el sensor ya existe en nuestra lista
          const index = prev.findIndex((s) => s.id === payload.id);

          if (index >= 0) {
            // Si existe, lo actualizamos
            const newSensores = [...prev];
            newSensores[index] = { ...newSensores[index], ...payload };
            return newSensores;
          } else {
            // Si es nuevo, lo agregamos
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

    // Cleanup: Desconectar al cerrar la página
    return () => {
      if (client) client.end();
    };
  }, []);

  return { sensores, status };
}
