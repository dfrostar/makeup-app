import mongoose from 'mongoose';

export interface IProduct {
  name: string;
  brand: string;
  category: 'Lipstick' | 'Eyeshadow' | 'Foundation' | 'Blush' | 'Mascara' | 'Eyeliner' | 'Concealer' | 'Powder' | 'Bronzer' | 'Other';
  description: string;
  price: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
  colors: Array<{
    name: string;
    hexCode: string;
  }>;
  ingredients: string[];
  features: string[];
  rating: number;
  reviews: Array<{
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Lipstick', 'Eyeshadow', 'Foundation', 'Blush', 'Mascara', 'Eyeliner', 'Concealer', 'Powder', 'Bronzer', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    url: String,
    alt: String
  }],
  colors: [{
    name: String,
    hexCode: String
  }],
  ingredients: [String],
  features: [String],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
