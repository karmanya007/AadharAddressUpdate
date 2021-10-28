const path = require('path');
const express = require('express');
const morgan = require('morgan');
const xss = require('xss-clean');
const compression = require('compression');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// View engine = ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));

// 1) GLOBAL MIDDLEWARES
// Dev logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization againsst XSS
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

app.all('*', (req, res, next) => {
    console.log("GG");
	next();
});


module.exports = app;