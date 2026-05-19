import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: [{ label: String, value: String, stock: { type: Number, default: 0 } }],
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: 0 },
    category: { type: String, required: true },
    subcategory: { type: String, default: '' },
    images: [{ type: String, required: true }],
    thumbnail: { type: String, default: '' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    brand: { type: String, default: '' },
    variants: [variantSchema],
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    trending: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    flashDeal: { type: Boolean, default: false },
    flashDealEnds: Date,
    tags: [String],
    isActive: { type: Boolean, default: true },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);
  }
  if (!this.thumbnail && this.images?.length) {
    this.thumbnail = this.images[0];
  }
  next();
});

productSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
