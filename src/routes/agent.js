import express from 'express';
import { createAgent, getAgents, getAgentById, updateAgent, desactivatedAgent,getAgentsPaginated } from '../controller/agent.js'; // Importa los controladores
import {authMiddleware} from '../middleware/authMiddleware.js'; // Importa el middleware de autenticación
import {verifyRoles} from '../middleware/verifyRoles.js'; // Importa el middleware para verificar roles
import {uploadFotoPerfil} from '../middleware/uploadFile.js'
const router = express.Router();

// Rutas del agente
router.post("/", authMiddleware, verifyRoles("ADMINISTRADOR"), uploadFotoPerfil, createAgent);
router.get("/", getAgents);
router.get("/paginated", authMiddleware, verifyRoles("ADMINISTRADOR"), getAgentsPaginated);
router.get("/:_id", authMiddleware, verifyRoles("ADMINISTRADOR"), getAgentById); // Cambiar a :_id
router.put("/:_id", authMiddleware, verifyRoles("ADMINISTRADOR"), uploadFotoPerfil, updateAgent); // Cambiar a :_id
router.patch("/:_id", authMiddleware, verifyRoles("ADMINISTRADOR"), desactivatedAgent); // Cambiar a :_id
export default router;
