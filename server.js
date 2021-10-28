const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	console.log(err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// Server
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
	console.log(`App running on port ${port}....`);
});

process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	console.log('(╬▔皿▔)╯ SIGTERM RECEIVED (╬▔皿▔)╯ . Shutting down...');
	server.close(() => {
		console.log('💢 Process terminated! 💢');
	});
});