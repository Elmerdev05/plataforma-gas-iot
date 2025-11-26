// SIMULADOR DE SENSOR ESP32
// Ejecutar con: node simulador-sensor.js

const mqtt = require("mqtt");

// Usamos el MISMO broker y tema que en la web
const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");
const TOPIC = "gasalert/sensores/cocina";

const sensorFalso = {
  id: "SENSOR_FANTASMA_02", // <--- CAMBIAMOS ESTO (Inventamos un ID)
  ubicacion: "Soy Falso",   // Esto no importa, el nombre lo pone la base de datos
  nivel: 500,               // Pongámosle peligro para que se note
  estado: "peligro",
  bateria: 50
};

client.on("connect", () => {
  console.log("🔌 Simulador conectado. Enviando datos...");

  // Enviar datos cada 2 segundos
  setInterval(() => {
    // Simulamos que el nivel de gas sube y baja aleatoriamente
    const variacion = Math.floor(Math.random() * 50) - 20;
    sensorFalso.nivel += variacion;
    if (sensorFalso.nivel < 0) sensorFalso.nivel = 0;

    // Lógica simple de estado
    if (sensorFalso.nivel > 400) sensorFalso.estado = "peligro";
    else if (sensorFalso.nivel > 200) sensorFalso.estado = "advertencia";
    else sensorFalso.estado = "seguro";

    // Bajamos batería poco a poco
    if (Math.random() > 0.8) sensorFalso.bateria -= 1;

    // Enviar JSON
    const mensaje = JSON.stringify(sensorFalso);
    client.publish(TOPIC, mensaje);
    console.log(`📤 Enviado: ${sensorFalso.nivel} ppm (${sensorFalso.estado})`);
  }, 2000);
});
