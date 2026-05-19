import express from 'express';
import {
  getUsers,
  getUser,
  blockUser,
  unblockUser,
  toggleWishlist,
  getWishlist,
  getAdminDashboard,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getAdminDashboard);
router.get('/wishlist', protect, authorize('user'), getWishlist);
router.post('/wishlist/:productId', protect, authorize('user'), toggleWishlist);
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.put('/:id/block', protect, authorize('admin'), blockUser);
router.put('/:id/unblock', protect, authorize('admin'), unblockUser);

export default router;
