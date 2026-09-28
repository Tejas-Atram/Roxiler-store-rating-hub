import express from 'express';
import { register, login, updatePassword } from '../controllers/authController.js';
import { registerValidationRules, passwordUpdateValidationRules } from '../middleware/validators.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerValidationRules, register);

router.post('/login', login);

router.put('/password', authenticateToken, passwordUpdateValidationRules, updatePassword);

export default router;