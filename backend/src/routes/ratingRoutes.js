import express from 'express';
import { submitRating, getStoreOwnerDashboard, replyToRating } from '../controllers/ratingController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { ratingValidationRules } from '../middleware/validators.js';

const router = express.Router();

router.post('/:storeId', authenticateToken, authorizeRoles('USER'), ratingValidationRules, submitRating);
router.get('/owner/dashboard', authenticateToken, authorizeRoles('STORE_OWNER'), getStoreOwnerDashboard);
router.post('/reply/:ratingId', authenticateToken, authorizeRoles('STORE_OWNER'), replyToRating);

export default router;