import express from 'express';
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  desactivateProperty,
  getFilteredProperties,
  getAllPropertiesIncludingInactive,
  getPropertyByType,
  getPropertyByIdWithAgent,
  getFeaturedProperties // Importar el controlador para propiedades destacadas
} from '../controller/property.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
import { uploadFotoCasa } from '../middleware/uploadFile.js';

const router = express.Router();

/**
 * Rutas para Propiedades
 */

// Crear una nueva propiedad
router.post(
  '/',
  authMiddleware,
  verifyRoles('ADMINISTRADOR'),
  uploadFotoCasa,
  createProperty
);

// Rutas GET específicas primero
router.get('/', getAllProperties);
router.get('/all', 
  authMiddleware,
  verifyRoles('ADMINISTRADOR'),
  getAllPropertiesIncludingInactive
);
router.get('/filter', getFilteredProperties); // Mover esta ruta antes de /:_id
router.get('/tipo-operacion/:tipo_operacion', getPropertyByType);
router.get('/all-with-agent/:_id', getPropertyByIdWithAgent);

// Nueva ruta: Obtener propiedades destacadas
router.get('/featured', getFeaturedProperties); // Añadir esta ruta antes de /:_id

// Ruta con parámetro dinámico al final
router.get('/:_id', authMiddleware,
  verifyRoles('ADMINISTRADOR'),getPropertyById);

// Otras rutas
router.put(
  '/:_id',
  authMiddleware,
  verifyRoles('ADMINISTRADOR'),
  uploadFotoCasa,
  updateProperty
);

router.patch(
  '/:_id/desactivate',
  authMiddleware,
  verifyRoles('ADMINISTRADOR'),
  desactivateProperty
);

export default router;
