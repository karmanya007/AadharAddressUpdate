const User = require("../models/userModel");
const factory = require('./handleFactory');
const fast2sms = require('fast-two-sms');
const { v4: uuidv4 } = require('uuid');

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// Do not update password with this!!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.sendLLSMSController = async (req,res)=>
{
  console.log(req.params.num);
  var options = {authorization : process.env.F2SMS_KEY , message : `Submit your consent at ${process.env.HOST_URL}/giveConsent/${req.params.num}-${uuidv4()}` ,  numbers : [req.params.num]} 
  const response = await fast2sms.sendMessage(options);
  console.log(response);
}
