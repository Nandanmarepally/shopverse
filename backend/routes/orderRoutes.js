import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getVendorOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('user'), createOrder);
router.get('/my', protect, authorize('user'), getMyOrders);
router.get('/vendor', protect, authorize('vendor'), getVendorOrders);
router.get('/admin/all', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('admin', 'vendor'), updateOrderStatus);

export default router;
