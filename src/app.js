import express from 'express';
import {connectDB} from './config/database.js'
import {corsMiddleware} from './config/cors.js'
import authRoutes from './routes/auth.js'; // Importa las rutas de autenticación
import userRoutes from './routes/users.js'; // Importa las rutas de usuarios
import agentRoutes from './routes/agent.js'; // Importa las rutas de usuarios
import propertyRoutes from './routes/property.js'; // Importa las rutas de propiedades
import contactRoutes from './routes/contact.js';
import cookieParser from 'cookie-parser';
const app = express();

// Middlewares
app.use(corsMiddleware);
app.use(cookieParser())
app.use(express.json());

// Conectar a la base de datos
connectDB();

app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/users', userRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/contact', contactRoutes);
export default app;  