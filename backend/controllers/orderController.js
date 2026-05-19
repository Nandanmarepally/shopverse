import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const createOrder = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    return next(new ErrorResponse('Cart is empty', 400));
  }

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return next(new ErrorResponse(`Insufficient stock for ${item.product.title}`, 400));
    }
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    title: item.product.title,
    image: item.product.thumbnail || item.product.images[0],
    quantity: item.quantity,
    price: item.price,
    variant: item.variant,
    vendor: item.product.vendor,
  }));

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod || 'COD',
    itemsPrice: cart.subtotal,
    taxPrice: cart.tax,
    deliveryPrice: cart.deliveryFee,
    totalPrice: cart.total,
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity, sold: item.quantity },
    });
  }

  cart.items = [];
  cart.calculateTotals();
  await cart.save();

  res.status(201).json({ success: true, data: order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, count: orders.length, data: orders });
});

export const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('orderItems.product', 'title thumbnail');
  if (!order) return next(new ErrorResponse('Order not found', 404));
  if (order.user.toString() !== req.user._id.toString() && req.user.role === 'user') {
    return next(new ErrorResponse('Not authorized', 403));
  }
  res.json({ success: true, data: order });
});

export const getVendorOrders = asyncHandler(async (req, res) => {
  const Vendor = (await import('../models/Vendor.js')).default;
  const vendor = await Vendor.findOne({ user: req.user._id });
  const orders = await Order.find({ 'orderItems.vendor': vendor._id })
    .populate('user', 'name email')
    .sort('-createdAt');
  res.json({ success: true, count: orders.length, data: orders });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt');
  res.json({ success: true, count: orders.length, data: orders });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorResponse('Order not found', 404));

  order.status = req.body.status;
  if (req.body.status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  await order.save();
  res.json({ success: true, data: order });
});
