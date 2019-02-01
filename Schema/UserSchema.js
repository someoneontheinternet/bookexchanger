var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  location: String,
  phone: String
});

module.exports = mongoose.model('User', userSchema);
