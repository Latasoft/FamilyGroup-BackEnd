import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  desactivatedUser,
} from '../controller/users.js'; // Importa los controladores
import {authMiddleware} from '../middleware/authMiddleware.js'; // Importa el middleware de autenticación
import {verifyRoles} from '../middleware/verifyRoles.js'; // Importa el middleware para verificar roles 
const router = express.Router();

// Rutas CRUD para usuarios
router.post('/', authMiddleware,verifyRoles('ADMINISTRADOR'),createUser, ); // Crear un usuario
router.get('/',authMiddleware,verifyRoles('ADMINISTRADOR'), getUsers); // Obtener todos los usuarios
router.get('/:_id',authMiddleware,verifyRoles('ADMINISTRADOR'), getUserById); // Obtener un usuario por ID
router.put('/:_id', authMiddleware,verifyRoles('ADMINISTRADOR'),updateUser); // Actualizar un usuario por ID
router.patch('/:_id', authMiddleware,verifyRoles('ADMINISTRADOR'),desactivatedUser); // Desactivar un usuario por ID
export default router;
