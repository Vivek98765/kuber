const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");
const sendEmail = require("../config/sendEmail");
const crypto = require("crypto");
const Token = require("../models/token");
const Joi = require("joi");
const multer = require('multer');

const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const token = jwt.sign({ email: req.body.email }, config.secret);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirmationCode: token,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({
              message:
                "User was registered successfully! Please check your email",
            });
            nodemailer.sendConfirmationEmail(
              user.username,
              user.email,
              user.confirmationCode
            );
            res.redirect("/");
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({
            message:
              "User was registered successfully! Please check your email",
          });

          nodemailer.sendConfirmationEmail(
            user.username,
            user.email,
            user.confirmationCode
          );
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      if (user.status != "Active") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        activeStep:user.activeStep,
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        status: user.status,
        middlename:user.middlename,
        lastname:user.lastname,
        designation:user.designation,
        contact_land:user.contact_land,
        countryCodeMob:user.countryCodeMob,
        contact_mob:user.contact_mob,
        business_card:user.business_card,
        agree:user.agree,
        recieve_sms:user.recieve_sms,
        comp_name: user.comp_name,
        trade_liscense: user.trade_liscense,
        liscense_issued: user.liscense_issued,
        date_incorp: user.date_incorp,
        trade_expiry: user.trade_expiry,
        attach_liscense: user.attach_liscense,
        last_moa: user.last_moa,
        attach_allmoa: user.attach_allmoa,
        comp_address: user.comp_address,
        uae: user.uae,
        emirates: user.emirates,
        area: user.area,
        street: user.street,
        building_name: user.building_name,
        floor: user.floor,
        door_no: user.door_no,
        po_box_no: user.po_box_no,
        comp_profile: user.comp_profile,
        office_land: user.office_land,
        comp_email: user.comp_email,
        website: user.website,
        linkdin_page: user.linkdin_page,
        twitter_page: user.twitter_page,
        facebook_page: user.facebook_page,
        // busifirstname:user.busifirstname,
        // busimiddlename:user.busimiddlename,
        // busilastname:user.busilastname,
        // busCountryCode:user.busCountryCode,
        // busimobile:user.busimobile,
        // busiemail:user.busiemail,
        // Ownership:user.Ownership,
        // shareholding:user.shareholding,
        // busidob:user.busidob,
        // nationality:user.nationality,
        // passNo:user.passNo,
        // dateIssue:user.dateIssue,
        // expDate:user.expDate,
        // resident:user.resident,
        // emiratesId:user.emiratesId,
        // uaeissuedate:user.uaeissuedate,
        // uaeexpdate:user.uaeexpdate,
        // attachpass:user.attachpass,
        // emid:user.emid,
        // recentbill:user.recentbill,
        BusinessDetailsArray:user.BusinessDetailsArray,
      });
    });
};

exports.verifyUser = (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.status = "Active";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
};

exports.getUserData = (req, res) =>{
  User.findById(req.params.id, (error,data) => {
    if(error){
      return error;//next(error)
    }
    else{
      res.json(data);
    }
  })
}

exports.updateProfile = (req, res, next)=>{

//const url = req.protocol + '://' + req.get('host')
//req.body.business_card = url + '/public/' + req.file.filename;
//console.log(req.files.business_card[0].path);
//console.log(req.files);
if(req.files && req.files.business_card){
  //console.log(req.files.business_card);
  req.body.business_card = req.files.business_card[0].path;
}
if(req.files && req.files.attach_liscense){
  //console.log(req.files.attach_liscense[0].path);
  req.body.attach_liscense = req.files.attach_liscense[0].path;
}
if(req.files && req.files.attach_allmoa){
  req.body.attach_allmoa = req.files.attach_allmoa;
}

var BusinessDetailsArray = [];
if(req.body.BusinessDetailsArray){
   BusinessDetailsArray = JSON.parse(req.body.BusinessDetailsArray);
}
if (BusinessDetailsArray.length > 0) {
  (BusinessDetailsArray).forEach(element => {
    //console.log(req.files.attachpass,req.files.emid );
    //console.log(element);
    if (element.emid) {
      if (req.files.emid) {
        const files = req.files.emid.filter( x => 
          x.originalname == element.emid 
        );
        
        //console.log(files);
        element.emid =files[0].path
      }
     
    }
    if (element.attachpass) {
      //console.log("attachpass");
      if (req.files.attachpass) {
        const files1 = req.files.attachpass.filter( x => 
          x.originalname == element.attachpass 
        );
        element.attachpass =files1[0].path
        //console.log(files1);
      }
     
    }
  });
}

if(BusinessDetailsArray.length > 0 ){
  req.body.BusinessDetailsArray = BusinessDetailsArray
  
}

  User.findByIdAndUpdate({_id: req.params.id},
    {
      $set:req.body
    },
    {new: true},
    (err,data)=>{
    if(err) throw err;
    res.json(data)
    //console.log(data);
      console.log('Data updated successfully !')
  });
}

exports.passwordReset = async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
        token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
    }

    const link = `${req.protocol}"://"${req.get('host')}/api/auth/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password reset", link);
    //console.log(user.email);
    //console.log(req.protocol+"://"+req.get('host'));

    res.send("Password reset link sent to your email account");
} catch (error) {
    res.send("An error occured for pass reset");
    console.log(error);
}
}

exports.confirmPass = async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send("Invalid link or expired");

    const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    user.password = bcrypt.hashSync(req.body.password, 8);
    await user.save();
    await token.delete();

    res.send("Password reset sucessfully.");
} catch (error) {
    res.send("An error occured");
    console.log(error);
}
}
