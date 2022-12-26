const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const errorHandler = require('../utils/errorHandler');

exports.getUser = async (req, res) => {
    try {
        // if (!(req.user.id === req.params.id || req.user.isAdmin)) {
        //     return errorHandler(res, "You have no permission to perform this action.", 403)
        // }
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) {
            return errorHandler(res, "User not found", 404);
        }
        res.status(200).json({ success: true, user: user });
    } catch (error) {
        console.log(error);
        return errorHandler(res);
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash');
        res.status(200).json({ success: true, count: users.length, users: users });
    } catch (error) {
        console.log(error);
        return errorHandler(res)
    }
}

exports.updateUser = async (req, res) => {
    try {
        // if (!(req.user.id === req.params.id || req.user.isAdmin)) {
        //     return errorHandler(res, "You have no permission to perform this action.", 403)
        // }
        const user = await User.findById(req.params.id);
        if (!user) {
            return errorHandler(res, "User not found", 404);
        }
        user.name = req.body.name ? req.body.name : user.name;
        user.email = req.body.email ? req.body.email : user.email
        user.passwordHash = req.body.passwordHash ? bcrypt.hashSync(req.body.passwordHash, 10) : user.passwordHash
        user.phone = req.body.phone ? req.body.phone : user.phone
        user.street = req.body.street ? req.body.street : user.street
        user.apartment = req.body.apartment ? req.body.apartment : user.apartment
        user.zip = req.body.zip ? req.body.zip : user.zip
        user.city = req.body.city ? req.body.city : user.city
        user.country = req.body.country ? req.body.country : user.country
        user.isAdmin = req.body.isAdmin
        await user.save();
        res.status(200).json({ success: true, message: "User updated successfully", user: user });
    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return errorHandler(res, "User not found", 404)
        await user.remove();
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}