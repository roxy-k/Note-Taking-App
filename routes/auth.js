const express = require('express');
const passport = require('passport');
const router = express.Router();

// Login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback (what happens when Google is done processing)
router.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('❌ Google Auth Error:', err);
      return res.redirect('/auth/failure');
    }
    if (!user) {
      return res.redirect('/');
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

// Facebook login
router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email','public_profile'] })
);
// Facebook callback
router.get('/auth/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', (err, user, info) => {
    if (err) {
      console.error('❌ Facebook Auth Error:', err);
      return res.redirect('/auth/failure');
    }
    if (!user) {
      return res.redirect('/');
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});
// Logging out
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/auth/failure', (req, res) => {
  res.send('Ошибка авторизации. Попробуйте ещё раз.');
});

module.exports = router;