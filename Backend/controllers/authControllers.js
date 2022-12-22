const { User } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const errorHandler = require('../utils/errorHandler');


exports.protect = async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return errorHandler(res, "Your are not logged in. Please login to continue.", 401);
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return errorHandler(res, "The user belonging to this token does no longer exist.", 401)
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
}

exports.restrictToAdmin = () => {
    return (req, res, next) => {
        if (!req.user.isAdmin) {
            return errorHandler(res, 'You do not have permission to perform this action', 403)
        }
        next();
    };
};


exports.Login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found with email' });
        }

        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                },
                process.env.SECRET_KEY,
                { expiresIn: '1d' }
            )
            res.status(200).json({ success: true, user: user.email, token: token })
        } else {
            res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err })
    }
}

exports.SignUp = async (req, res) => {
    try {
        req.body.passwordHash = bcrypt.hashSync(req.body.passwordHash, 10)
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error })
    }
}