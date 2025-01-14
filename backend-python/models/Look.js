const mongoose = require('mongoose');

const lookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    url: String,
    alt: String
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    usage: String // Description of how the product is used in this look
  }],
  steps: [{
    order: Number,
    description: String,
    image: {
      url: String,
      alt: String
    }
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  occasion: {
    type: String,
    enum: ['Everyday', 'Party', 'Wedding', 'Work', 'Special Occasion'],
    required: true
  },
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add indexes for better search performance
lookSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Look = mongoose.model('Look', lookSchema);
module.exports = Look;
