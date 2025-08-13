import { verifyToken } from '../utils/jwtUtil.js'; // Importa la función para verificar el token

// Middleware para verificar uno o más roles
export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = verifyToken(token);
      const userRole = decoded.role; // El rol está en el token como "role"

      // Verifica si el rol del usuario está en la lista de roles permitidos
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
      }

      // Si el rol es válido, permite que continúe
      req.user = decoded; // Almacena el usuario en req para futuras referencias
      next();
    } catch (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ message: 'Token is not valid', details: err.message });
    }
  };
};
