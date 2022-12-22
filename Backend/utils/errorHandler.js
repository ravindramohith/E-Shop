function errorHandler(res, message, statusCode) {
    res.status(statusCode || 500).json({ success: false, message: message || "Something went wrong in server side :(" });
}

module.exports = errorHandler;

