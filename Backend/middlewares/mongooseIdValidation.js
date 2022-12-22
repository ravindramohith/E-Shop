const mongoose = require('mongoose');

exports.mongooseIDValidation = async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid Mongoose object ID" })
    }
    next();
}