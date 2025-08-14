import cors from 'cors';
import { isProduction } from './config.js'; // Verifica si estás en producción

const allowedOrigins = ['http://localhost:4200']; //temporal
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
