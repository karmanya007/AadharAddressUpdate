const { v4: uuidv4 } = require('uuid');
exports.getOverview = async (req, res, next) => {
	const reqId = uuidv4();
	res.status(200).render('index');
};