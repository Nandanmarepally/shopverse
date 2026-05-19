import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import { sendTokenResponse } from '../utils/generateToken.js';

// @desc    Register user (public - user role only)
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return next(new ErrorResponse('Email already registered', 400));

  const user = await User.create({
    name,
    email,
    password,
    phone: phone || '',
    role: 'user',
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Login (unified for user, vendor, admin)
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (user.isBlocked) {
    return next(new ErrorResponse('Your account has been blocked', 403));
  }

  if (user.role === 'vendor') {
    const vendor = await Vendor.findOne({ user: user._id });
    if (!vendor) {
      return next(new ErrorResponse('Vendor profile not found', 403));
    }
    if (!vendor.isApproved) {
      return next(new ErrorResponse('Your vendor account is pending approval', 403));
    }
    if (vendor.isBlocked) {
      return next(new ErrorResponse('Your vendor account has been blocked', 403));
    }
  }

  user.password = undefined;
  sendTokenResponse(user, 200, res);
});

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'title price thumbnail discountPrice');
  let vendorProfile = null;
  if (user.role === 'vendor') {
    vendorProfile = await Vendor.findOne({ user: user._id });
  }
  res.json({ success: true, user, vendorProfile });
});

// @desc    Update profile
// @route   PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req, res, next) => {
  const fields = ['name', 'phone', 'avatar'];
  const updates = {};
  fields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, user });
});

// @desc    Update password
// @route   PUT /api/auth/password
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc    Logout
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 1000), httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Add address
// @route   POST /api/auth/addresses
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

// @desc    Update address
// @route   PUT /api/auth/addresses/:id
export const updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);
  if (!address) return next(new ErrorResponse('Address not found', 404));
  Object.assign(address, req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:id
export const deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.addresses.pull(req.params.id);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});
