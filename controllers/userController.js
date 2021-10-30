const User = require("../models/userModel");
exports.createAccountController = (req, res) => {
  console.log(req.body);
 
  User.find({ UID: req.body.uid }, (err, arr) => {
    console.log(arr.length);
    if (arr.length == 0) {
      const newUser = new User({
        UID: req.body.uid,
        phoneNumber: 99999999,
        role: "user",
        log: "kuch bi",
      });
      newUser.save((err) => {
        if (err) {
          console.log(error);
        } else {
          console.log("Data inserted");
        }
      });
    }
    else{
        console.log("user exist");
    }
    //console.log(arr);
  });
 
  //res.redirect('/sendConsent')
  //console.log("what");
};
