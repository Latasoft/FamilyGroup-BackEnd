import express from 'express';
import { loginUser, logout, isAuthenticated, getRoleFromToken, getRemainingTime, getIdFromToken } from '../controller/auth.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/login', loginUser);
router.post('/logout', logout);
router.get('/isAuthenticated', isAuthenticated); 
router.get('/role', authMiddleware, getRoleFromToken); 
router.get('/remainingTime',authMiddleware ,getRemainingTime); 
router.get('/userId', authMiddleware,getIdFromToken);

export default router;