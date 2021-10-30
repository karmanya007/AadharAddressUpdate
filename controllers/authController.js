const {promisify} = require('util');
const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, req, res) => {
	let secure;
	const token = signToken(user._id);
	if (process.env.NODE_ENV != 'development')
		secure = req.secure || req.headers('x-forwarded-proto') === 'https';

	res.cookie('jwt', token, {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
		secure: secure,
	});

	res.status(statusCode).json({
		status: 'success',
		token,
		data: {
			user,
		},
	});
};

exports.login = catchAsync(async (req, res, next) => {
	const { UID } = req.body;

	// 1) Chack if uid exists
	if (!UID) {
		return next();
	}
	// 2) Check if user exists 
	const user = await User.findOne({ UID });

	if (!user) {
		const newUser = await User.create({
            UID: req.body.UID,
            phoneNumber: req.body.phoneNumber,
            log: req.body.log,
            role: req.body.role
        });
    
        createSendToken(newUser, 201, req, res);
	}
	// 3) If everything OK, send then to the client
	createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
	// 1) Get token and check if it exists
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}

	if (!token) {
		return next(new AppError('You are not logged in! Please log in to get access', 401));
	}
	// 2) Verify token
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// 3) Check if user still exists
	const currentUser = await User.findById(decoded.id);
	if (!currentUser) {
		return next(new AppError('The user belonging to this token does not exist', 401));
	}

	// Grant access to the protect route
	req.user = currentUser;
	res.locals.user = currentUser;
	next();
});

// Only for rendered pages, no erroes!
exports.isLoggedIn = async (req, res, next) => {
	// 1) Get token and check if it exists
	if (req.cookies.jwt) {
		try {
			// 1) Verification
			const decoded = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.JWT_SECRET
			);

			// 2) Check if user still exists
			const currentUser = await User.findById(decoded.id);
			if (!currentUser) {
				return next();
			}

			// There is a logged in user
			res.locals.user = currentUser;
			return next();
		} catch (err) {
			return next();
		}
	}
	next();
};

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new AppError('You do not have permission to perform this action', 403));
		}
		next();
	};
};