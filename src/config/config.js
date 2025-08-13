import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el equivalente de __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar las variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

 
const PORT = process.env.PORT

// Token de firma para los usuarios
const JWT_SECRET = process.env.JWT_SECRET;
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
const  MONGO_URL=process.env.MONGO_URL;
const EMAIL_USER= process.env.EMAIL_USER;
const EMAIL_PASSWORD= process.env.EMAIL_PASSWORD;
const EMAIL_DEST= process.env.EMAIL_DEST;
const isProduction=process.env.NODE_ENV === 'production';
// Exportar las variables de entorno
export { 
        JWT_SECRET,
        FIREBASE_STORAGE_BUCKET,
        PORT,
        EMAIL_USER,
        EMAIL_PASSWORD,
        EMAIL_DEST,
        isProduction,
        MONGO_URL
};