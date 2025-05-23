const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
require('dotenv').config();
require('./config/passport');
const mongoose = require('mongoose');
const UserProfile = require('./models/userProfile'); // ⬅️ Добавлено

const app = express();
const Note = require('./models/note');

mongoose.connect('mongodb+srv://katysheva1992:Balabanova92!@cluster0.b7eip4f.mongodb.net/', {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'html'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Middleware: передаём profile во все шаблоны, если пользователь залогинен
app.use(async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const userProfile = await UserProfile.findOne({ userId: req.user.googleId });
      res.locals.profile = userProfile; // ⬅️ Доступен в EJS как profile
    } catch (err) {
      console.error('Error fetching profile for layout:', err.message);
    }
  }
  next();
});

// Routes
app.use('/dashboard', require('./routes/dashboard'));
app.use('/notes', require('./routes/notes'));
app.use('/api', require('./routes/api'));
app.use('/', require('./routes/auth'));

// Главная страница
app.get('/', (req, res) => {
  res.render('login', { user: req.user });
});

// Middleware для защиты маршрутов
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the app`);
});
