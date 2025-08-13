import { verifyToken } from '../utils/jwtUtil.js'; // Importa la función para verificar el token

// Middleware para verificar la validez del token
export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Almacenar los datos del usuario decodificado en la request
    next(); // Continuar al siguiente middleware o controlador
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(403).json({ message: 'Token verification failed', details: error.message });
  }
};
