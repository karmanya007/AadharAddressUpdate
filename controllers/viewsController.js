const { v4: uuidv4 } = require('uuid');
exports.getOverview = async (req, res, next) => {
	const reqId = uuidv4();
	res.status(200).render('index');
};
exports.sendConsentController = async (req,res)=>
{
	res.status(200).render('sendConsent');
}
exports.giveConsentController = async (req,res) =>
{
	res.status(200).render('giveConsent');
}
exports.confirmConsentController = async (req,res) =>
{
	res.status(200).render('confirmConsent');
}
exports.editAddressController = async (req,res) =>
{
	res.status(200).render('editAddress');
}
exports.giveConsentController = async (req,res)=>
{
	res.status(200).render('llLogin',{url:req.params.id})
}

exports.giveConsentResponseController = async (req,res)=>
{
	res.status(200).render('giveConsent',{url:req.params.id})
}