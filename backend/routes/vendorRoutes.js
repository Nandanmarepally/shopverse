import express from 'express';
import {
  createVendor,
  getVendors,
  getVendor,
  approveVendor,
  blockVendor,
  getVendorDashboard,
  updateVendorProfile,
} from '../controllers/vendorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('vendor'), getVendorDashboard);
router.put('/profile', protect, authorize('vendor'), updateVendorProfile);
router.get('/', protect, authorize('admin'), getVendors);
router.post('/', protect, authorize('admin'), createVendor);
router.get('/:id', protect, authorize('admin'), getVendor);
router.put('/:id/approve', protect, authorize('admin'), approveVendor);
router.put('/:id/block', protect, authorize('admin'), blockVendor);

export default router;
