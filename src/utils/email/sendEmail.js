const nodemailer = require('nodemailer');

function sendEmail(user, reservation, type) {
  const { name, email } = user;

  const { entryDate, exitDate, day, hour } = reservation;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });
  let htmlContent = '';

  switch (type) {
    case 'Alojamiento':
      htmlContent = `
       <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #1b4332; text-align: center;">Verificación de reserva</h1>
          <p>Hola ${name},</p>
          <p>Reserva realizada correctamente:</p>
          <p>Día de entrada: ${entryDate}</p>
          <p>Día de salida: ${exitDate}</p>
          <p>Si no solicitaste esta reserva, puedes ignorar este correo.</p>
            <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
              <p>&copy;Ecoturismo 2025. Todos los derechos reservados.</p>
            </footer>
        </div>
      `;
      break;

    case 'Actividad':
      htmlContent = `
       <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #1b4332; text-align: center;">Verificación de reserva</h1>
          <p>Hola ${name},</p>
          <p>Reserva realizada correctamente:</p>
          <p>Día de la actividad: ${day}</p>
          <p>Hora de la actividad: ${hour}</p>
          <p>Si no solicitaste esta reserva, puedes ignorar este correo.</p>
            <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
              <p>&copy;Ecoturismo 2025. Todos los derechos reservados.</p>
            </footer>
        </div>
      `;
      break;
    case 'Cancelar':
      htmlContent = `
       <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #1b4332; text-align: center;">Cancelación de reserva</h1>
          <p>Hola ${name},</p>
          <p>Reserva anulada correctamente</p>
          <p>Si no solicitaste esta reserva, puedes ignorar este correo.</p>
            <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
              <p>&copy;Ecoturismo 2025. Todos los derechos reservados.</p>
            </footer>
        </div>
      `;
      break;

    default:
      break;
  }

  transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: email,
      html: htmlContent,
      subject: 'Verificación de reservas'
    },
    (error, info) => {
      if (error) {
        console.log('Error al enviar el correo', error);
      } else {
        console.log('Correo enviado correctamente', info.response);
      }
    }
  );
}
module.exports = { sendEmail };
