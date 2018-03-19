var nodemailer = require("nodemailer");
var emailConfig = require("../../config/config.js").email;
module.exports = {
  emailSend: function(userData, mailOptions) {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        auth: {
          user: emailConfig.SMTPUserName,
          pass: emailConfig.SMTPPassword
        }
      });
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          reject({ message: " Email Not Send Sucessfully" });
        } else {
          resolve({ message: " Email Send Sucessfully" });
        }
      });
    });
  }
};
