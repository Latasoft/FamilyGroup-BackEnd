import { transporter } from '../config/emailConfig.js';
import { EMAIL_DEST, EMAIL_USER } from '../config/config.js';

export const sendContactEmail = async (req, res) => {
  const formData = req.body;

  // Validar que todos los campos estén presentes
  const missingFields = Object.keys(formData).filter(key => !formData[key]);
  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Faltan los siguientes campos: ${missingFields.join(', ')}` });
  }

  // Construir el contenido dinámico del correo
  let dynamicContent = '';
  for (const [key, value] of Object.entries(formData)) {
    dynamicContent += `<p><strong>${key}:</strong> ${value}</p>`;
  }

  const mailOptions = {
    from: `"Formulario de Contacto" <${EMAIL_USER}>`,
    to: EMAIL_DEST,
    subject: formData.subject || 'Nuevo mensaje de contacto',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="background: #4CAF50; color: white; padding: 10px;">Nuevo mensaje de contacto</h1>
        ${dynamicContent}
        <hr>
        <footer style="text-align: center; color: #888;">
          <p>Este mensaje fue enviado desde el formulario de contacto.</p>
        </footer>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
};
