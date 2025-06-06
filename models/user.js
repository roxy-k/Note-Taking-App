const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String,  unique: true, sparse: true }, 
  facebookId: { type: String, unique: true, sparse: true }, 
  email: String,
  name: String,
  avatar: String 
});

module.exports = mongoose.model('User', userSchema);
