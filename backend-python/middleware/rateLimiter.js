const redisClient = require('../../config/redis');

const rateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip;
        const key = `ratelimit:${ip}`;
        
        const window = process.env.RATE_LIMIT_WINDOW || 15; // 15 seconds
        const maxRequests = process.env.RATE_LIMIT_MAX_REQUESTS || 100;

        const requests = await redisClient.incr(key);
        
        if (requests === 1) {
            await redisClient.set(key, '1', { EX: window });
        }

        if (requests > maxRequests) {
            return res.status(429).json({
                error: 'Too Many Requests',
                details: `Please try again after ${window} seconds`
            });
        }

        next();
    } catch (error) {
        console.error('Rate limiter error:', error);
        // If Redis fails, allow the request to proceed
        next();
    }
};

module.exports = rateLimiter;
