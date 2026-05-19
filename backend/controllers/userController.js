import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import Order from '../models/Order.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password').sort('-createdAt');
  res.json({ success: true, count: users.length, data: users });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return next(new ErrorResponse('User not found', 404));
  res.json({ success: true, data: user });
});

export const blockUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse('User not found', 404));
  user.isBlocked = true;
  await user.save();
  res.json({ success: true, data: user });
});

export const unblockUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse('User not found', 404));
  user.isBlocked = false;
  await user.save();
  res.json({ success: true, data: user });
});

export const toggleWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const index = user.wishlist.indexOf(productId);

  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  await user.populate('wishlist', 'title price thumbnail discountPrice ratings slug');
  res.json({ success: true, wishlist: user.wishlist });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'wishlist',
    'title price discountPrice thumbnail ratings slug stock'
  );
  res.json({ success: true, data: user.wishlist });
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const [users, vendors, products, orders] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    (await import('../models/Vendor.js')).default.countDocuments(),
    (await import('../models/Product.js')).default.countDocuments(),
    Order.countDocuments(),
  ]);

  const revenue = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(10);

  const pendingVendors = await (await import('../models/Vendor.js')).default
    .find({ isApproved: false, isBlocked: false })
    .populate('user', 'name email')
    .limit(5);

  res.json({
    success: true,
    data: {
      users,
      vendors,
      products,
      orders,
      revenue: revenue[0]?.total || 0,
      recentOrders,
      pendingVendors,
    },
  });
});
