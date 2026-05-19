import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product', 'title thumbnail price discountPrice stock');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
    cart = await Cart.findById(cart._id).populate('items.product', 'title thumbnail price discountPrice stock');
  }
  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.calculateTotals();
  await cart.save();
  res.json({ success: true, data: cart });
});

export const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1, variant = '' } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return next(new ErrorResponse('Product not found', 404));
  }
  if (product.stock < quantity) {
    return next(new ErrorResponse('Insufficient stock', 400));
  }

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  let cart = await getOrCreateCart(req.user._id);

  const existingIndex = cart.items.findIndex(
    (item) => item.product._id.toString() === productId && item.variant === variant
  );

  if (existingIndex > -1) {
    const newQty = cart.items[existingIndex].quantity + quantity;
    if (newQty > product.stock) {
      return next(new ErrorResponse('Insufficient stock', 400));
    }
    cart.items[existingIndex].quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity, variant, price });
  }

  cart.calculateTotals();
  await cart.save();
  cart = await Cart.findById(cart._id).populate('items.product', 'title thumbnail price discountPrice stock');
  res.json({ success: true, data: cart });
});

export const updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) return next(new ErrorResponse('Cart item not found', 404));

  const product = await Product.findById(item.product);
  if (quantity < 1) {
    cart.items.pull(req.params.itemId);
  } else {
    if (quantity > product.stock) {
      return next(new ErrorResponse('Insufficient stock', 400));
    }
    item.quantity = quantity;
  }

  cart.calculateTotals();
  await cart.save();
  const updated = await Cart.findById(cart._id).populate('items.product', 'title thumbnail price discountPrice stock');
  res.json({ success: true, data: updated });
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.id(req.params.itemId);
  if (!item) return next(new ErrorResponse('Cart item not found', 404));
  cart.items.pull(req.params.itemId);
  cart.calculateTotals();
  await cart.save();
  const updated = await Cart.findById(cart._id).populate('items.product', 'title thumbnail price discountPrice stock');
  res.json({ success: true, data: updated });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  cart.calculateTotals();
  await cart.save();
  res.json({ success: true, data: cart });
});
