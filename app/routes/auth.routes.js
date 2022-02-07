const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const multer = require('multer');
const path = require('path');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  const DIR = './public/';

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      //cb(null, DIR);
      if (file.fieldname === "business_card") {
        cb(null, DIR + 'business_card');
      } 
      else if(file.fieldname === 'attach_allmoa'){
        cb(null, DIR + 'attach_allmoa');
      }
      else if(file.fieldname === 'attach_liscense') {
        cb(null, DIR + 'attach_liscense');
      }
      else if(file.fieldname === 'attachpass') {
        cb(null, DIR + 'attachpass');
      }
      else{
        cb(null, DIR + 'emid');
      }
    },
    filename: (req, file, cb) => {
      //console.log(file.fieldname);
      //const fileName = file.originalname.toLowerCase().split(' ').join('-');
      if(file.fieldname === 'business_card'){
        cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
      }
      else if(file.fieldname === 'attach_liscense'){
        cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
      }
      else if(file.fieldname === 'attach_allmoa'){
        cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
      }
      else if(file.fieldname === 'attachpass'){
        
        cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
      }
      else if(file.fieldname === 'emid'){
        cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
      }
    }
  });
  

  var upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 500
    },
    fileFilter: (req, file, cb) => {
      //console.log(file.mimetype);
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "video/mp4" || file.mimetype == "video/webm") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg, mp4, webm and .jpeg format allowed!'));
      }
    }
  })
  
  

  app.post("/api/auth/updateprofile/:id",upload.fields([
    {name: 'business_card', maxCount: 1},
    {name: 'attach_liscense', maxCount: 1},
    {name:'attach_allmoa',maxCount: 10},
    {name: 'attachpass', maxCount: 10},
    {name: 'emid', maxCount: 10},
  ]), controller.updateProfile);


  app.post("/api/auth/password-reset", controller.passwordReset);
  app.post("/api/auth/password-reset/:userId/:token", controller.confirmPass);

  app.get("/api/auth/userdata/:id", controller.getUserData);

  app.get("/api/auth/confirm/:confirmationCode", controller.verifyUser)
};
