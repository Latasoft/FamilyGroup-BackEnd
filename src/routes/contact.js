import express from 'express';
import { sendContactEmail } from '../controller/contact.js';

const router = express.Router();

// Ruta POST para el formulario de contacto
router.post('/', sendContactEmail);

export default router;
