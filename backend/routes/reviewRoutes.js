import express from 'express';
import {
  createReview,
  getProductReviews,
  deleteReview,
  getFeaturedReviews,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/featured', getFeaturedReviews);
router.get('/product/:productId', getProductReviews);
router.post('/', protect, authorize('user'), createReview);
router.delete('/:id', protect, deleteReview);

export default router;
