import { comparePassword } from '../utils/bcryptUtil.js'; // Importa la función para verificar la contraseña
import { generateToken, verifyToken } from '../utils/jwtUtil.js'; // Importa la función para generar el token JWT
import { Usuario } from '../models/users.js'; // Importa el modelo de usuario
import { isProduction } from '../config/config.js';
// Función de inicio de sesión
export async function loginUser(req, res) {
    
    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
        const user = await Usuario.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado.' });
        }

        if (!user.is_active) {
            return res.status(403).json({ message: 'Usuario no activo en el sistema. Por favor, contacte al administrador.' });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            console.warn('Contraseña incorrecta para el usuario:', normalizedEmail);
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const token = generateToken({ _id: user._id, role: user.rol_usuario });

        


        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Usar directamente isProduction
            sameSite: 'none', // Cambiar a 'none' en producción con HTTPS
            maxAge: 86400000, // 1 día
        });

        return res.status(200).json({
            message: 'Inicio de sesión exitoso', // Devolver el token JWT para pruebas
        });
    } catch (error) {
        console.error('Error en el servidor durante el inicio de sesión:', error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
}


export async function logout(req, res) {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true, // Mismo valor que al crear
            sameSite: 'none', // Mismo valor que al crear
            path: '/', // Asegúrate de que coincida
        });
        return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al cerrar sesión' });
    }
}

export function isAuthenticated(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ authenticated: false, message: 'No autenticado' });
    }

    try {
        verifyToken(token);
        return res.status(200).json({ authenticated: true, message: 'Autenticado' });
    } catch (error) {
        return res.status(403).json({ authenticated: false, message: 'Token inválido o expirado' });
    }
}

export function getRoleFromToken(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Token no encontrado' });
    }

    try {
        const decoded = verifyToken(token);
        return res.status(200).json({ role: decoded.role, message: 'Rol recuperado con éxito' });
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado', details: error.message });
    }
}

function getTokenExpirationDateFromToken(token) {
    try {
        const decoded = verifyToken(token); // Decodifica el token
        if (decoded.exp) {
            const expirationDate = new Date(0); // Inicializa en UNIX epoch
            expirationDate.setUTCSeconds(decoded.exp); // Asigna segundos UTC desde el token
            return expirationDate;
        }
        return null; // Si no hay fecha de expiración
    } catch (error) {
        throw new Error('Error al decodificar el token');
    }
}

export function getRemainingTime(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ remainingTime: 0, message: 'No autenticado' });
    }

    try {
        const expirationDate = getTokenExpirationDateFromToken(token); // Reutiliza la lógica
        if (expirationDate) {
            const remainingTime = expirationDate.valueOf() - Date.now(); // Calcular tiempo restante en ms
            return res.status(200).json({ remainingTime: Math.max(remainingTime, 0), message: 'Tiempo restante calculado con éxito' });
        }

        return res.status(400).json({ remainingTime: 0, message: 'Token sin fecha de expiración' });
    } catch (error) {
        return res.status(500).json({ remainingTime: 0, message: 'Error al calcular el tiempo restante', details: error.message });
    }
}


export function getIdFromToken(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Token no encontrado' });
    }

    try {
        const decodedToken = verifyToken(token);
        return res.status(200).json({ _id: decodedToken._id, message: 'ID del usuario recuperado con éxito' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener el ID del token', details: error.message });
    }
}

