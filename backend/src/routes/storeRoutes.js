import express from 'express';
import { createStore, getStores } from '../controllers/storeController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { storeValidationRules } from '../middleware/validators.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('ADMIN'), storeValidationRules, createStore);
router.get('/', authenticateToken, getStores);

export default router;