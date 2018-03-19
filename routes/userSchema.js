var mongoose = require("mongoose");
var Schema = mongoose.Schema;
module.exports = {
  UserDetail: function() {
    var UserSchema = new Schema({
      emial: String,
      password: String,
      token: String
    });
    return mongoose.model("Users", UserSchema);
  }
};
