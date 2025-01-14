require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import routes
const authRoutes = require('./backend/routes/auth');
const productRoutes = require('./backend/routes/products');
const lookRoutes = require('./backend/routes/looks');
const searchRoutes = require('./backend/routes/search');
const virtualTryOnRoutes = require('./backend/routes/virtualTryOn');
const analyticsRoutes = require('./backend/routes/analytics');
const skincareRoutes = require('./backend/routes/skincare');
const recommendationRoutes = require('./backend/routes/recommendations');
const socialRoutes = require('./backend/routes/social');

// Import middleware
const errorHandler = require('./backend/middleware/errorHandler');
const rateLimiter = require('./backend/middleware/rateLimiter');

// Import services
const redisClient = require('./config/redis');

// Create Express app
const app = express();

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
app.use(rateLimiter);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/looks', lookRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/virtual-try-on', virtualTryOnRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/skincare', skincareRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/social', socialRoutes);

// Serve static files for face-api.js models
app.use('/models', express.static(path.join(__dirname, 'models')));

// Error handling
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Connect to Redis
redisClient.connect()
    .then(() => console.log('Connected to Redis'))
    .catch(err => console.error('Redis connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
