import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const createReview = asyncHandler(async (req, res, next) => {
  const { productId, rating, title, comment } = req.body;

  const existing = await Review.findOne({ user: req.user._id, product: productId });
  if (existing) return next(new ErrorResponse('You already reviewed this product', 400));

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    title,
    comment,
  });

  await updateProductRatings(productId);

  res.status(201).json({ success: true, data: review });
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort('-createdAt');
  res.json({ success: true, count: reviews.length, data: reviews });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorResponse('Review not found', 404));

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized', 403));
  }

  const productId = review.product;
  await review.deleteOne();
  await updateProductRatings(productId);

  res.json({ success: true, message: 'Review deleted' });
});

const updateProductRatings = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const product = await Product.findById(productId);
  if (!product) return;

  if (reviews.length === 0) {
    product.ratings = 0;
    product.numReviews = 0;
  } else {
    product.ratings = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    product.numReviews = reviews.length;
  }
  await product.save();
};

export const getFeaturedReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ rating: { $gte: 4 } })
    .populate('user', 'name avatar')
    .populate('product', 'title thumbnail')
    .sort('-createdAt')
    .limit(8);
  res.json({ success: true, data: reviews });
});
