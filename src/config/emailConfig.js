import nodemailer from 'nodemailer';
import {EMAIL_PASSWORD,EMAIL_USER} from'./config.js';

// Crear el transportador
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  // Verificar la conexión con el servicio de correo
transporter.verify((error, success) => {
    if (error) {
      console.error('Error al configurar Nodemailer:', error);
    } else {
      console.log('Nodemailer configurado correctamente');
    }
  });
  
export {transporter};