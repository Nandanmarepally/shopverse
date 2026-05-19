import express from 'express';
import {
  getProducts,
  getProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getSimilarProducts,
  getVendorProducts,
  getAdminProducts,
  toggleProductFlag,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadFields } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/vendor/my', protect, authorize('vendor'), getVendorProducts);
router.get('/admin/all', protect, authorize('admin'), getAdminProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id/similar', getSimilarProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('vendor', 'admin'), uploadFields, createProduct);
router.put('/:id', protect, authorize('vendor', 'admin'), uploadFields, updateProduct);
router.patch('/:id/flag', protect, authorize('admin'), toggleProductFlag);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteProduct);

export default router;
