import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  variant: { type: String, default: '' },
  price: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 49 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  this.deliveryFee = this.subtotal > 499 ? 0 : 49;
  this.tax = Math.round(this.subtotal * 0.18);
  this.total = this.subtotal + this.deliveryFee + this.tax;
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
