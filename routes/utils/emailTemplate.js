module.exports = {
  resetTemplate: function(userData, emailData) {
    return new Promise((resolve, reject) => {
      console.log(1);
      let resetTemplate = {
        to: emailData.to,
        from: emailData.from,
        subject: emailData.subject,
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          "http://" +
          "10.100.205.35:3000" +
          "/change-password/" +
          userData.token +
          "\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n"
      };
      resolve(resetTemplate);
    });
  }
};
