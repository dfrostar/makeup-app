const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        avatar: {
            type: String,
            default: null
        },
        skinType: {
            type: String,
            enum: ['dry', 'oily', 'combination', 'normal', 'sensitive'],
            default: null
        },
        skinConcerns: [{
            type: String,
            trim: true
        }],
        preferredBrands: [{
            type: String,
            trim: true
        }]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    favorites: {
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        looks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Look'
        }]
    },
    metrics: {
        engagementScore: {
            type: Number,
            default: 0
        },
        lastActive: {
            type: Date,
            default: Date.now
        },
        loginCount: {
            type: Number,
            default: 0
        }
    },
    preferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        productRecommendations: {
            type: Boolean,
            default: true
        },
        trendAlerts: {
            type: Boolean,
            default: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ 'profile.name': 1 });
userSchema.index({ 'metrics.engagementScore': -1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
