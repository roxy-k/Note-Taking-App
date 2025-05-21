const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const UserProfile = require('../models/userProfile'); // подключаем профиль

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Найти или создать пользователя (в users коллекции)
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName
        });
        await user.save();
      }

      // Найти или создать профиль (в userProfiles коллекции)
      let userProfile = await UserProfile.findOne({ userId: profile.id });
      if (!userProfile) {
        userProfile = new UserProfile({
          userId: profile.id,
          email: profile.emails[0].value,
          displayName: profile.displayName,
          avatar: profile.photos[0].value,
          preferences: {
            fontSize: 16,
            fontColor: '#000000',
            fontFamily: 'Arial',
            noteBackground: '#ffffff'
          }
        });
      } else {
        // Обновить дату последнего входа
        userProfile.lastLogin = new Date();
      }

      await userProfile.save();

      return done(null, user); // сохраняем только user в сессию
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id); // сохраняем в сессию Mongo ObjectId
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // теперь user доступен как req.user
  } catch (err) {
    done(err);
  }
})