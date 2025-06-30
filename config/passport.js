const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const UserProfile = require('../models/userProfile'); 
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ['profile', 'email']
  },
  
 async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        email: profile.emails[0]?.value,
        name: profile.displayName,
        avatar: profile.photos?.[0]?.value || '/dog-avatar.png'
      });
      await user.save();
    }

    let userProfile = await UserProfile.findOne({ userId: profile.id });

    if (!userProfile) {
      userProfile = new UserProfile({
        userId: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        avatar: profile.photos?.[0]?.value || '/dog-avatar.png',
        preferences: {
          fontSize: 16,
          fontColor: '#000000',
          fontFamily: 'Arial',
          noteBackground: '#ffffff'
        }
      });

      try {
        await userProfile.save();
      } catch (err) {
        if (err.code === 11000) {
          console.log('Duplicate userProfile detected, skipping creation.');
        } else {
          return done(err);
        }
      }
    } else {
      userProfile.lastLogin = new Date();
      await userProfile.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });
      if (!user) {
        user = new User({
          facebookId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value || '/dog-avatar.png'
        });
        await user.save();
      }

      
      let userProfile = await UserProfile.findOne({ userId: profile.id });
      if (!userProfile) {
        userProfile = new UserProfile({
          userId: profile.id,
          email: profile.emails[0].value,
          displayName: profile.displayName,
          avatar: profile.photos?.[0]?.value || '/dog-avatar.png',
          preferences: {
            fontSize: 16,
            fontColor: '#000000',
            fontFamily: 'Arial',
            noteBackground: '#ffffff'
          }
        });
      } else {
        // 
        userProfile.lastLogin = new Date();
      }

try {
  await userProfile.save();
} catch (err) {
  if (err.code === 11000) {
    console.log('Duplicate userProfile detected, skipping creation.');
    return done(null, user);
  } else {
    return done(err);
  }
}
return done(null, user);


      return done(null, user); 
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); 
  } catch (err) {
    done(err);
  }
})