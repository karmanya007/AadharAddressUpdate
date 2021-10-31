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
  
  const getUser = await User.findOne({UID:req.body.aano},(err,data)=>
  {
    console.log(data);
    if(err)
    console.log(err);
  }).clone().catch((err)=>
  {
    console.log(err);
  })
  const newUUID = uuidv4()
  await User.findByIdAndUpdate(getUser._id,{targetId:`${req.params.num}-${newUUID}`},(err)=>
  {
    if(err)
    {
      console.log(err);
    }
  }).clone()
  await User.findByIdAndUpdate(getUser._id,{status:'wait'},(err)=>
  {
    if(err)
    {
      console.log(err);
    }
  }).clone()
  
  var options = {authorization : process.env.F2SMS_KEY , message : `Submit your consent at ${process.env.HOST_URL}/giveConsent/${req.params.num}-${newUUID}` ,  numbers : [req.params.num]} 
  const response = await fast2sms.sendMessage(options);
  res.redirect(`/stauts/${req.params.num}-${newUUID}`,{res})
  console.log(response);
}
exports.postConsentController = async(res,req)=>
{
  
  console.log(req.req.body);
 const getUser = await User.findOne({targetId:req.req.body.tId},(err,data)=>
  {
    //console.log(data);
    if(err)
    console.log(err);
  }).clone().catch((err)=>
  {
    console.log(err);
  })
  if(getUser.status == "wait")
  {
    await User.findByIdAndUpdate(getUser._id,{status :req.req.body.resp},(err,data)=>
  {
    console.log("status changed");
    console.log(data);
    if(err)
    {
      console.log(err);
    }
  }).clone()
  }
}