// server/api/routes/contact.js
import express from 'express';
import verifyRecaptchaToken from '../../utils/verifyRecaptcha.js';

const router = express.Router();

router.post('/contacto', async (req, res) => {
  const { name, email, message, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ error: 'Falta el token de reCAPTCHA' });
  }

  const result = await verifyRecaptchaToken(recaptchaToken, 'contacto');

  if (!result.isHuman) {
    return res.status(403).json({ error: 'Verificación reCAPTCHA fallida' });
  }

  console.log('Mensaje recibido:', { name, email, message });
  res.json({ success: true, message: 'Mensaje enviado correctamente' });
});

export default router;
