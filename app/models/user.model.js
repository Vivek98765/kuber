const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    activeStep:String,
    username: String,
    email:String,
    middlename:String,
    lastname:String,
    designation:String,
    contact_land:String,
    countryCodeMob:String,
    contact_mob:String,
    business_card:String,
    agree:String,
    recieve_sms:String,
    comp_name: String,
    trade_liscense: String,
    liscense_issued: String,
    date_incorp: String,
    trade_expiry: String,
    attach_liscense: String,
    last_moa: String,
    attach_allmoa: {String},
    comp_address: String,
    uae: String,
    emirates: String,
    area: String,
    street: String,
    building_name: String,
    floor: String,
    door_no: String,
    po_box_no: String,
    comp_profile: String,
    office_land: String,
    comp_email: String,
    website: String,
    linkdin_page: String,
    twitter_page: String,
    facebook_page: String,
    // busifirstname:String,
    // busimiddlename:String,
    // busilastname:String,
    // busCountryCode:String,
    // busimobile:String,
    // busiemail:String,
    // Ownership:String,
    // shareholding:String,
    // busidob:String,
    // nationality:String,
    // passNo:String,
    // dateIssue:String,
    // expDate:String,
    // resident:String,
    // emiratesId:String,
    // uaeissuedate:String,
    // uaeexpdate:String,
    // attachpass:String,
    // emid:String,
    // recentbill:String,
    BusinessDetailsArray:Array,
    password: String,
    status: {
      type: String, 
      enum: ['Pending', 'Active'],
      default: 'Pending'
    },
    confirmationCode: { 
      type: String, 
      unique: true },

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

// const validate = (user) => {
//   const schema = Joi.object({
//       username: Joi.string().required(),
//       email: Joi.string().email().required(),
//       password: Joi.string().required(),
//   });
//   return schema.validate(user);
// };

module.exports = User;
