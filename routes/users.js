var express = require("express");
var router = express.Router();
var passport = require("passport");
var restResponse = require("express-rest-response");
var JsonStrategy = require("passport-json").Strategy;
var nodemailer = require("nodemailer");
var session = require("express-session");
var mongoose = require("mongoose");
var asyncHandler = require("express-async-handler");
var tokenGenerator = require("./utils/tokenGeneration.js");
var emailGenerator = require("./utils/emailGeneration.js");
var UserDetails = require("./userSchema.js").UserDetail();
var dbConfig = require("../config/config.js").db.dbURL;
var emailTemplates = require("./utils/emailTemplate.js");
var emailData = require("../config/config.js").resetPasswordContent;

mongoose
  .connect(dbConfig)
  .then(() => console.log("connection succesful"))
  .catch(err => console.error(err));

passport.use(
  new JsonStrategy((username, password, done) => {
    UserDetails.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

router.post("/login", (req, res, next) => {
  if (req.session.user) {
    return res.rest.badRequest("User already Logged In");
  }
  passport.authenticate("json", function(err, user, info) {
    if (!user) {
      return res.rest.badRequest(info);
    } else {
      let message = { message: "Sucessfully logged In", id: user._id };
      req.session.user = user;
      return res.rest.success(message);
    }
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  if (req.session.user) {
    req.session.destroy();
    let message = { message: "Sucessfully logged out" };
    res.rest.success(message);
  } else {
    res.rest.badRequest("User not logged in");
  }
});

router.post(
  "/reset",
  asyncHandler(async function(req, res, next) {
    function updatePassword(token) {
      return new Promise((resolve, reject) => {
        if (req.body.token != undefined && req.body.password != undefined) {
          UserDetails.findOneAndUpdate(
            { token: req.body.token },
            { password: req.body.password },
            function(err, user) {
              if (err) {
                reject(err);
              }
              resolve({ message: "password reseted sucessfully" });
            }
          );
        } else {
          console.log("outside");
          reject({ message: "Please Check token and password" });
        }
      });
    }
    let token = await updatePassword();
    return res.rest.success(token);
  })
);

router.post(
  "/forgot",
  asyncHandler(async (req, res, next) => {
    function userDataandToken(token) {
      return new Promise((resolve, reject) => {
        UserDetails.findOne({ username: req.body.email }, (err, user) => {
          if (err) {
            reject(err);
          }
          if (!user) {
            reject({ message: "User details are Incorrect" });
          }
          user.token = token;
          resolve(user);
        });
      });
    }
    function updateToken(userData, UserDetails) {
      return new Promise((resolve, reject) => {
        UserDetails.findByIdAndUpdate(
          userData._id,
          { token: userData.token },
          function(err, place) {
            if (err) {
              reject({ message: " Server Issue" });
            } else {
              resolve({ message: "updated Sucessfully" });
            }
          }
        );
      });
    }
    let token = await tokenGenerator.getToken();
    let userData = await userDataandToken(token);
    let updateTokenMessage = await updateToken(userData, UserDetails);
    let mailOptions = await emailTemplates.resetTemplate(userData, emailData);
    let emailSendSucess = await emailGenerator.emailSend(userData, mailOptions);
    return res.rest.success(emailSendSucess);
  })
);

module.exports = router;
