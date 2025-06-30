const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true // Google ID
  },
  email: {
    type: String,
    required: true
    
  },
  displayName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '/dog-avatar.png' 
  },
  preferences: {
    fontSize: { type: Number, default: 16 },
    fontColor: { type: String, default: '#000000' },
    fontFamily: { type: String, default: 'Arial' },
    noteBackground: { type: String, default: '#ffffff' }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);

