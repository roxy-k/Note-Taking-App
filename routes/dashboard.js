const express = require('express');
const router = express.Router();
const UserProfile = require('../models/userProfile');
const Note = require('../models/note');

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

// GET /dashboard/preferences — показать форму
router.get('/preferences', isLoggedIn, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user.googleId });
    res.render('preferences', {
      profile,
      user: req.user
    });
  } catch (err) {
    console.error('Error loading preferences:', err.message);
    res.status(500).send('Server error');
  }
});


// POST /dashboard/preferences — обновить настройки
router.post('/preferences', isLoggedIn, async (req, res) => {
  console.log('Received form data:', req.body);

  const { fontSize, fontColor, fontFamily, noteBackground } = req.body;

  try {
    await UserProfile.findOneAndUpdate(
      { userId: req.user.googleId },
      {
        $set: {
          'preferences.fontSize': fontSize,
          'preferences.fontColor': fontColor,
          'preferences.fontFamily': fontFamily,
          'preferences.noteBackground': noteBackground
        }
      }
    );
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error updating preferences:', err.message);
    res.status(500).send('Update failed');
  }
});
// GET /dashboard/stats — показать статистику
router.get('/stats', isLoggedIn, async (req, res) => {
  try {
    const totalNotes = await Note.countDocuments({ owner: req.user._id });

    const categoryCounts = await Note.aggregate([
      { $match: { owner: req.user._id } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentNotes = await Note.find({ owner: req.user._id })
                                  .sort({ createdAt: -1 })
                                  .limit(5);

    res.render('stats', {
      totalNotes,
      categoryCounts,
      recentNotes
    });
  } catch (err) {
    console.error('Error loading stats:', err.message);
    res.status(500).send('Server error');
  }
});



module.exports = router;
