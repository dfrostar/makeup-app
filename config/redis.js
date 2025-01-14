const Redis = require('redis');

class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            if (!this.client) {
                this.client = Redis.createClient({
                    url: process.env.REDIS_URL || 'redis://localhost:6379',
                    retry_strategy: (options) => {
                        if (options.attempt > 10) {
                            return new Error('Redis connection retry exhausted');
                        }
                        return Math.min(options.attempt * 100, 3000);
                    }
                });

                this.client.on('error', (err) => {
                    console.error('Redis Client Error:', err);
                    this.isConnected = false;
                });

                this.client.on('connect', () => {
                    console.log('Redis Client Connected');
                    this.isConnected = true;
                });

                await this.client.connect();
            }
            return this.client;
        } catch (error) {
            console.error('Redis connection error:', error);
            throw error;
        }
    }

    async get(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.get(key);
        } catch (error) {
            console.error('Redis get error:', error);
            throw error;
        }
    }

    async set(key, value, options = {}) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            await this.client.set(key, value, options);
        } catch (error) {
            console.error('Redis set error:', error);
            throw error;
        }
    }

    async incr(key) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.incr(key);
        } catch (error) {
            console.error('Redis incr error:', error);
            throw error;
        }
    }

    async zadd(key, score, member) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            await this.client.zAdd(key, [{ score, value: member }]);
        } catch (error) {
            console.error('Redis zadd error:', error);
            throw error;
        }
    }

    async zrevrange(key, start, stop, withScores = false) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.zRange(key, start, stop, {
                REV: true,
                WITHSCORES: withScores
            });
        } catch (error) {
            console.error('Redis zrevrange error:', error);
            throw error;
        }
    }
}

module.exports = new RedisClient();
