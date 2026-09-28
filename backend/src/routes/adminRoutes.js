import express from 'express';
import { getDashboardStats, addUser, getUsers } from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { registerValidationRules } from '../middleware/validators.js';

const router = express.Router();

router.use(authenticateToken, authorizeRoles('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.post('/users', registerValidationRules, addUser);

export default router;