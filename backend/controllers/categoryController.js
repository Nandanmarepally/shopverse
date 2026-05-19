import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Category from '../models/Category.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('name');
  res.json({ success: true, count: categories.length, data: categories });
});

export const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) return next(new ErrorResponse('Category not found', 404));
  res.json({ success: true, data: category });
});

export const createCategory = asyncHandler(async (req, res, next) => {
  const exists = await Category.findOne({ slug: req.body.slug });
  if (exists) return next(new ErrorResponse('Category already exists', 400));
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) return next(new ErrorResponse('Category not found', 404));
  res.json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new ErrorResponse('Category not found', 404));
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});
