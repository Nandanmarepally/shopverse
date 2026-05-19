import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Admin creates vendor account
// @route   POST /api/vendors
export const createVendor = asyncHandler(async (req, res, next) => {
  const { name, email, password, businessName, businessPhone, description } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return next(new ErrorResponse('Email already exists', 400));

  const user = await User.create({
    name,
    email,
    password,
    role: 'vendor',
  });

  const vendor = await Vendor.create({
    user: user._id,
    businessName,
    businessPhone: businessPhone || '',
    description: description || '',
    isApproved: req.body.isApproved === true || req.body.isApproved === 'true',
    approvedBy: req.body.isApproved ? req.user._id : undefined,
    approvedAt: req.body.isApproved ? Date.now() : undefined,
  });

  res.status(201).json({
    success: true,
    data: {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      vendor,
    },
  });
});

export const getVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find()
    .populate('user', 'name email phone avatar isBlocked')
    .sort('-createdAt');
  res.json({ success: true, count: vendors.length, data: vendors });
});

export const getVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id).populate('user', 'name email phone');
  if (!vendor) return next(new ErrorResponse('Vendor not found', 404));
  res.json({ success: true, data: vendor });
});

export const approveVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return next(new ErrorResponse('Vendor not found', 404));

  vendor.isApproved = true;
  vendor.isBlocked = false;
  vendor.approvedAt = Date.now();
  vendor.approvedBy = req.user._id;
  await vendor.save();

  res.json({ success: true, data: vendor });
});

export const blockVendor = asyncHandler(async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return next(new ErrorResponse('Vendor not found', 404));

  vendor.isBlocked = true;
  vendor.isApproved = false;
  await vendor.save();

  res.json({ success: true, data: vendor });
});

export const getVendorDashboard = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  const products = await Product.find({ vendor: vendor._id });
  const orders = await Order.find({ 'orderItems.vendor': vendor._id });

  const totalRevenue = orders.reduce((acc, order) => {
    const vendorItems = order.orderItems.filter(
      (item) => item.vendor?.toString() === vendor._id.toString()
    );
    return acc + vendorItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, 0);

  const lowStock = products.filter((p) => p.stock < 10);

  res.json({
    success: true,
    data: {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      lowStock: lowStock.length,
      recentOrders: orders.slice(0, 5),
      topProducts: products.sort((a, b) => b.sold - a.sold).slice(0, 5),
    },
  });
});

export const updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOneAndUpdate({ user: req.user._id }, req.body, {
    new: true,
    runValidators: true,
  });
  res.json({ success: true, data: vendor });
});
