const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.message
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Unauthorized',
            details: 'Invalid token or no token provided'
        });
    }

    if (err.name === 'MulterError') {
        return res.status(400).json({
            error: 'File Upload Error',
            details: err.message
        });
    }

    // Handle custom error types
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            error: err.name || 'Error',
            details: err.message
        });
    }

    // Default error
    res.status(500).json({
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};

module.exports = errorHandler;
