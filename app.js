const path = require('path');
const express = require('express');
const morgan = require('morgan');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const viewRouter = require('./routes/viewRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// View engine = ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES

// Implement CORS
app.use(cors());

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Dev logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('combined'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// Test middleware
/* app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	// console.log(req.requestTime);
	next();
}); */

// 3) ROUTES
app.use('/', viewRouter);
 app.use('/users', userRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});


module.exports = app;