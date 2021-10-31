const User = require("../models/userModel");
const factory = require('./handleFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const fast2sms = require('fast-two-sms');
const unzipper = require('unzipper');
const fs = require("fs");
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const { v4: uuidv4 } = require('uuid');


exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
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
  res.redirect(`/status/${req.params.num}-${newUUID}`)
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
  console.log(getUser);
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

  console.log(parseInt(req.req.body.tId.slice(0,10),10));

  const llUser = await User.findOne({phoneNumber:9906143871},(err,data)=>
  {
    //console.log(data);
    if(err)
    console.log(err);
  }).clone().catch((err)=>
  {
    console.log(err);
  })

  if(req.req.body.resp == 'yes'){
    (async () => {
      try {
        const directory = await unzipper.Open.file(`./public/Ekyc/${llUser.fileName}`);
        const extracted = await directory.files[0].buffer(llUser.shareCode);
        // If the extracted entity is a file,
        // converting the extracted buffer to string would print the file content
        console.log(extracted.toString());
        parser.parseString(extracted.toString(), async function(error, result) {
          if(error === null) {
              console.log(result.OfflinePaperlessKyc.UidData);
              getUser.shareCode = llUser.shareCode;
              await getUser.save();
          }
          else {
              console.log(error);
          }
      });
      } catch(e) {
        console.log(e);
      }
    })();
  }else {
    try {
      await fs.unlink(`./public/Ekyc/${getUser.fileName}`, (err) => {
        if (err) {
          console.error(err);
        }else{
          console.log('Process terminated');
        }
      });
    } catch (error) {
      console.log(error);
    }
    
  }
}

exports.getEkycController = catchAsync(async(res, req, next) => {
  console.log(req.req.body.ekyc);
  try {
    await fs.writeFile(`./public/Ekyc/${req.req.body.fileName}`, req.req.body.ekyc, 'base64', () => {
      return next();
    });
  } catch (err) {
    console.log(err);
    return next(new AppError('Internal server error', 500));
  }
});

exports.getAddress = catchAsync(async (req,res,next) => {
  const user = await User.findOne({targetId: req.body.tId});

  (async () => {
    try {
      const directory = await unzipper.Open.file(`./public/Ekyc/${user.fileName}`);
      const extracted = await directory.files[0].buffer(user.shareCode);
      // If the extracted entity is a file,
      // converting the extracted buffer to string would print the file content
      console.log(extracted.toString());
      parser.parseString(extracted.toString(), async function(error, result) {
        if(error === null) {
            console.log(result.OfflinePaperlessKyc.UidData);
            const kycData = result.OfflinePaperlessKyc.UidData;
            res.status(200).json({
              status: 'success',
              data:{
                data:kycData
              }
            })
        }
        else {
            console.log(error);
        }
    });
    } catch(e) {
      console.log(e);
    }
  })();
});