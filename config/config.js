const config = {
  app: {
    port: 6000,
    host: "10.100.110.132"
  },
  db: {
    dbURL: "mongodb://gcpsdatabase:computer@ds012578.mlab.com:12578/gcpsdata"
  },
  email: {
    SMTPUserName: "qozqukkjdh7ead4y@ethereal.email",
    SMTPPassword: "hKAqegY3kyqSQC1ypP",
    host: "smtp.ethereal.email",
    port: 587,
    from: "selva1990kumaremali@gmail.com"
  },
  resetPasswordContent: {
    to: "selva1990kumar@gmail.com",
    from: "selva1999kumarselva@gmail.com",
    subject: "GCPS USER PASSWORD RESET"
  }
};
module.exports = config;
