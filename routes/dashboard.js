const express = require('express');
const router = express.Router();
const UserProfile = require('../models/userProfile');

// ✅ Middleware для защиты маршрута
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

// ✅ GET /dashboard — показать дашборд с профилем
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user.googleId });

    if (!userProfile) {
      return res.status(404).send('User profile not found');
    }

    // ✅ Передаём данные в шаблон dashboard.ejs
    res.render('dashboard', {
      user: req.user,             // из passport
      profile: userProfile        // из userProfile коллекции
    });
  } catch (err) {
    console.error('Error loading dashboard:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
