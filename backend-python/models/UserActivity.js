const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['view', 'like', 'comment', 'share', 'purchase', 'search', 'try_on'],
        required: true
    },
    details: {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        lookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Look'
        },
        searchQuery: String,
        tryOnResult: String,
        metadata: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    deviceInfo: {
        userAgent: String,
        platform: String,
        device: String
    },
    location: {
        country: String,
        region: String,
        city: String
    }
});

// Create indexes for analytics queries
userActivitySchema.index({ user: 1, timestamp: -1 });
userActivitySchema.index({ type: 1, timestamp: -1 });
userActivitySchema.index({ 'details.productId': 1, timestamp: -1 });
userActivitySchema.index({ 'details.lookId': 1, timestamp: -1 });
userActivitySchema.index({ timestamp: -1 });

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;
