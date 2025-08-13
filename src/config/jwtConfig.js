import {JWT_SECRET} from './config.js'; // Importa la clave secreta desde config
export const jwtConfig = {
    secret: JWT_SECRET,
    expiresIn: '1d', // Tiempo de expiración del token (24 horas)
};
 