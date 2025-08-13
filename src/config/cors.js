import cors from 'cors';
import { isProduction } from './config.js'; // Verifica si estás en producción

const allowedOrigins = ['https://frontendinmobiliaria-hzc3.onrender.com','https://familypropiedades.cl','https://frontendinmobiliaria.onrender.com'] // Reemplaza con la URL de tu frontend en producción
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permitir cookies y encabezados de autenticación
};

export const corsMiddleware = cors(corsOptions);
