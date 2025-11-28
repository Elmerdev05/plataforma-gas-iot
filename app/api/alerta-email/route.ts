import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { sensor, valor } = data;

    // 1. Configurar el Transportador (El cartero de Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // La clave de aplicación
      },
    });

    // 2. Configurar el Mensaje (HTML bonito)
    const mailOptions = {
      from: `"Sistema GasAlert 🚨" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Te lo mandas a ti mismo (o a quien quieras)
      subject: "¡PELIGRO! Fuga de Gas Detectada 🔥",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #d32f2f;">⚠️ ALERTA CRÍTICA DE SEGURIDAD</h2>
          <p>El sistema ha detectado niveles peligrosos de gas.</p>
          
          <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Ubicación:</strong> ${sensor}</p>
            <p><strong>Nivel Actual:</strong> <span style="font-size: 20px; font-weight: bold; color: #d32f2f;">${valor} ppm</span></p>
          </div>

          <p>Por favor, revisa la zona inmediatamente.</p>
          <a href="https://gasalert-iot.vercel.app" style="background-color: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir al Panel de Control</a>
        </div>
      `,
    };

    // 3. Enviar
    await transporter.sendMail(mailOptions);
    console.log("📧 Correo de alerta enviado a:", process.env.GMAIL_USER);

    return NextResponse.json({ message: "Email enviado" });

  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json({ error: "Fallo al enviar email" }, { status: 500 });
  }
}