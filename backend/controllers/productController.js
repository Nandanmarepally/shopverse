import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import APIFeatures from '../utils/apiFeatures.js';
import { uploadMultiple } from '../services/cloudinaryService.js';

export const getProducts = asyncHandler(async (req, res) => {
  let query = Product.find({ isActive: true }).populate('vendor', 'businessName logo rating');

  if (req.query.category) query = query.where('category').equals(req.query.category);
  if (req.query.trending === 'true') query = query.where('trending').equals(true);
  if (req.query.featured === 'true') query = query.where('featured').equals(true);
  if (req.query.flashDeal === 'true') query = query.where('flashDeal').equals(true);
  if (req.query.minPrice) query = query.where('price').gte(Number(req.query.minPrice));
  if (req.query.maxPrice) query = query.where('price').lte(Number(req.query.maxPrice));
  if (req.query.minRating) query = query.where('ratings').gte(Number(req.query.minRating));

  const features = new APIFeatures(query, req.query);
  const products = await features.search().filter().sort().limitFields().paginate().query;

  const total = await Product.countDocuments(
    buildFilter(req.query)
  );

  res.json({ success: true, count: products.length, total, data: products });
});

const buildFilter = (q) => {
  const filter = { isActive: true };
  if (q.category) filter.category = q.category;
  if (q.trending === 'true') filter.trending = true;
  if (q.featured === 'true') filter.featured = true;
  if (q.keyword) filter.title = { $regex: q.keyword, $options: 'i' };
  return filter;
};

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('vendor', 'businessName logo rating')
    .populate('reviews.user', 'name avatar');
  if (!product) return next(new ErrorResponse('Product not found', 404));
  res.json({ success: true, data: product });
});

export const getProductBySlug = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('vendor', 'businessName logo rating');
  if (!product) return next(new ErrorResponse('Product not found', 404));
  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) return next(new ErrorResponse('Vendor profile not found', 404));

  let images = [];
  let thumbnail = '';

  if (req.files?.images) {
    const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    images = await uploadMultiple(imageFiles);
  }
  if (req.files?.thumbnail) {
    const thumbFiles = Array.isArray(req.files.thumbnail) ? req.files.thumbnail : [req.files.thumbnail];
    const result = await uploadMultiple(thumbFiles);
    thumbnail = result[0];
  }

  if (!thumbnail && images.length) thumbnail = images[0];

  const product = await Product.create({
    ...req.body,
    price: Number(req.body.price),
    discountPrice: Number(req.body.discountPrice) || 0,
    stock: Number(req.body.stock),
    images: images.length ? images : req.body.images || [],
    thumbnail,
    vendor: vendor._id,
    trending: req.body.trending === 'true' || req.body.trending === true,
    featured: req.body.featured === 'true' || req.body.featured === true,
    flashDeal: req.body.flashDeal === 'true' || req.body.flashDeal === true,
  });

  vendor.totalProducts += 1;
  await vendor.save();

  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse('Product not found', 404));

  const vendor = await Vendor.findOne({ user: req.user._id });
  if (req.user.role === 'vendor' && product.vendor.toString() !== vendor?._id.toString()) {
    return next(new ErrorResponse('Not authorized to update this product', 403));
  }

  if (req.files?.images) {
    const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    const newImages = await uploadMultiple(imageFiles);
    req.body.images = [...(product.images || []), ...newImages];
  }

  const numericFields = ['price', 'discountPrice', 'stock'];
  numericFields.forEach((f) => {
    if (req.body[f] !== undefined) req.body[f] = Number(req.body[f]);
  });

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: product });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse('Product not found', 404));

  const vendor = await Vendor.findOne({ user: req.user._id });
  if (req.user.role === 'vendor' && product.vendor.toString() !== vendor?._id.toString()) {
    return next(new ErrorResponse('Not authorized', 403));
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product removed' });
});

export const getSimilarProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const similar = await Product.find({
    category: product?.category,
    _id: { $ne: req.params.id },
    isActive: true,
  })
    .limit(8)
    .select('title price discountPrice thumbnail ratings slug');
  res.json({ success: true, data: similar });
});

export const getVendorProducts = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  const products = await Product.find({ vendor: vendor._id }).sort('-createdAt');
  res.json({ success: true, count: products.length, data: products });
});

export const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate('vendor', 'businessName')
    .sort('-createdAt');
  res.json({ success: true, count: products.length, data: products });
});

export const toggleProductFlag = asyncHandler(async (req, res, next) => {
  const { field, value } = req.body;
  const allowed = ['trending', 'featured', 'flashDeal', 'isActive'];
  if (!allowed.includes(field)) {
    return next(new ErrorResponse('Invalid field', 400));
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { [field]: value },
    { new: true }
  );
  res.json({ success: true, data: product });
});
