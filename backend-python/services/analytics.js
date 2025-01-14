const { UserActivity, Product, Look, User } = require('../models');
const { promisify } = require('util');
const redis = require('redis');

class AnalyticsService {
    constructor() {
        this.client = redis.createClient({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        });
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.incrAsync = promisify(this.client.incr).bind(this.client);
    }

    // Track user activity
    async trackActivity(userId, activityType, details) {
        try {
            const activity = new UserActivity({
                user: userId,
                type: activityType,
                details,
                timestamp: new Date()
            });

            await activity.save();

            // Update real-time metrics
            await this.updateRealTimeMetrics(activityType, details);

            // Update user engagement score
            if (userId) {
                await this.updateUserEngagement(userId);
            }
        } catch (error) {
            console.error('Activity tracking error:', error);
            throw error;
        }
    }

    // Update real-time metrics
    async updateRealTimeMetrics(activityType, details) {
        const now = new Date();
        const hour = now.getHours();
        const date = now.toISOString().split('T')[0];

        // Update hourly metrics
        await this.incrAsync(`metrics:${date}:${hour}:${activityType}`);

        // Update product-specific metrics
        if (details.productId) {
            await this.incrAsync(`product:${details.productId}:${activityType}`);
        }

        // Update look-specific metrics
        if (details.lookId) {
            await this.incrAsync(`look:${details.lookId}:${activityType}`);
        }
    }

    // Update user engagement score
    async updateUserEngagement(userId) {
        const weights = {
            view: 1,
            like: 2,
            comment: 3,
            share: 4,
            purchase: 5
        };

        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        // Get user's recent activities
        const activities = await UserActivity.find({
            user: userId,
            timestamp: { $gte: monthAgo }
        });

        // Calculate engagement score
        let score = activities.reduce((total, activity) => {
            return total + (weights[activity.type] || 0);
        }, 0);

        // Update user's engagement score
        await User.findByIdAndUpdate(userId, {
            'metrics.engagementScore': score
        });

        return score;
    }

    // Get product analytics
    async getProductAnalytics(productId, period = '7d') {
        try {
            const endDate = new Date();
            const startDate = new Date();
            
            switch (period) {
                case '24h':
                    startDate.setDate(startDate.getDate() - 1);
                    break;
                case '7d':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case '30d':
                    startDate.setDate(startDate.getDate() - 30);
                    break;
                default:
                    startDate.setDate(startDate.getDate() - 7);
            }

            const activities = await UserActivity.aggregate([
                {
                    $match: {
                        'details.productId': productId,
                        timestamp: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            type: '$type',
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]);

            return this.formatAnalytics(activities, startDate, endDate);
        } catch (error) {
            console.error('Product analytics error:', error);
            throw error;
        }
    }

    // Get look analytics
    async getLookAnalytics(lookId, period = '7d') {
        try {
            const endDate = new Date();
            const startDate = new Date();
            
            switch (period) {
                case '24h':
                    startDate.setDate(startDate.getDate() - 1);
                    break;
                case '7d':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case '30d':
                    startDate.setDate(startDate.getDate() - 30);
                    break;
                default:
                    startDate.setDate(startDate.getDate() - 7);
            }

            const activities = await UserActivity.aggregate([
                {
                    $match: {
                        'details.lookId': lookId,
                        timestamp: { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            type: '$type',
                            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]);

            return this.formatAnalytics(activities, startDate, endDate);
        } catch (error) {
            console.error('Look analytics error:', error);
            throw error;
        }
    }

    // Format analytics data
    formatAnalytics(activities, startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const metrics = {
            views: Array(dates.length).fill(0),
            likes: Array(dates.length).fill(0),
            shares: Array(dates.length).fill(0),
            comments: Array(dates.length).fill(0)
        };

        activities.forEach(activity => {
            const dateIndex = dates.indexOf(activity._id.date);
            if (dateIndex !== -1) {
                switch (activity._id.type) {
                    case 'view':
                        metrics.views[dateIndex] = activity.count;
                        break;
                    case 'like':
                        metrics.likes[dateIndex] = activity.count;
                        break;
                    case 'share':
                        metrics.shares[dateIndex] = activity.count;
                        break;
                    case 'comment':
                        metrics.comments[dateIndex] = activity.count;
                        break;
                }
            }
        });

        return {
            dates,
            metrics
        };
    }

    // Get trending analytics
    async getTrendingAnalytics() {
        try {
            const now = new Date();
            const dayAgo = new Date(now.setDate(now.getDate() - 1));

            const trending = await UserActivity.aggregate([
                {
                    $match: {
                        timestamp: { $gte: dayAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            type: '$type',
                            targetId: {
                                $cond: [
                                    { $ifNull: ['$details.productId', false] },
                                    '$details.productId',
                                    '$details.lookId'
                                ]
                            },
                            targetType: {
                                $cond: [
                                    { $ifNull: ['$details.productId', false] },
                                    'product',
                                    'look'
                                ]
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: {
                            targetId: '$_id.targetId',
                            targetType: '$_id.targetType'
                        },
                        score: {
                            $sum: {
                                $switch: {
                                    branches: [
                                        { case: { $eq: ['$_id.type', 'view'] }, then: { $multiply: ['$count', 1] } },
                                        { case: { $eq: ['$_id.type', 'like'] }, then: { $multiply: ['$count', 2] } },
                                        { case: { $eq: ['$_id.type', 'comment'] }, then: { $multiply: ['$count', 3] } },
                                        { case: { $eq: ['$_id.type', 'share'] }, then: { $multiply: ['$count', 4] } }
                                    ],
                                    default: 0
                                }
                            }
                        }
                    }
                },
                {
                    $sort: { score: -1 }
                },
                {
                    $limit: 10
                }
            ]);

            // Populate trending items with details
            const trendingWithDetails = await Promise.all(
                trending.map(async item => {
                    let details;
                    if (item._id.targetType === 'product') {
                        details = await Product.findById(item._id.targetId)
                            .select('name brand category');
                    } else {
                        details = await Look.findById(item._id.targetId)
                            .select('name category creator');
                    }
                    return {
                        ...item,
                        details
                    };
                })
            );

            return trendingWithDetails;
        } catch (error) {
            console.error('Trending analytics error:', error);
            throw error;
        }
    }
}

module.exports = new AnalyticsService();
