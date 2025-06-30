const express = require('express');
const passport = require('passport');
const router = express.Router();

// Login
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback (what happens when Google is done processing)
router.get('/auth/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/', 
    successRedirect: '/dashboard'
  })
);
// Facebook login
router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email','public_profile'] })
);
// Facebook callback
router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { 
    failureRedirect: '/', 
    successRedirect: '/dashboard' 
  })
);
// Logging out
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;