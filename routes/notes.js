const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const UserProfile = require('../models/userProfile'); 

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

// GET /notes/new — render the form to create a new note
router.get('/new', isLoggedIn, (req, res) => {
  res.render('notes/new');
});

// GET /notes/category/:category — filter notes by category
router.get('/category/:category', isLoggedIn, async (req, res) => {
  const category = req.params.category;

  try {
    const notes = await Note.find({ category, owner: req.user._id });
    const categories = await Note.find({ owner: req.user._id }).distinct('category');
    const userProfile = await UserProfile.findOne({ userId: req.user.googleId }); // ✅ исправлено
    res.render('notes/index', { notes, categories, profile: userProfile });
  } catch (err) {
    console.error('Error filtering by category:', err.message);
    res.status(500).send('Server error');
  }
});

// GET /notes — list all notes for the current user
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user._id });
    const categories = await Note.find({ owner: req.user._id }).distinct('category');
    const userProfile = await UserProfile.findOne({ userId: req.user.googleId }); // ✅ исправлено
    res.render('notes/index', { notes, categories, profile: userProfile });
  } catch (err) {
    console.error('Error getting notes:', err.message);
    res.status(500).send('Server Error');
  }
});

// POST /notes — create a new note and redirect back to notes list
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const newNote = new Note({
      title,
      content,
      category,
      owner: req.user._id
    });

    await newNote.save();
    res.redirect('/notes');
  } catch (err) {
    console.error('Error creating note:', err.message);
    res.status(500).send('Error creating note');
  }
});

// GET /notes/:id/edit — render edit form
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    const userProfile = await UserProfile.findOne({ userId: req.user.googleId }); // ✅ исправлено
    if (!note) return res.status(404).send('Note not found');
    res.render('notes/edit', { note, profile: userProfile });
  } catch (err) {
    console.error('Error loading edit form:', err.message);
    res.status(500).send('Server error');
  }
});

// POST /notes/:id/edit — update the note
router.post('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title, content, category }
    );
    res.redirect('/notes/' + req.params.id);
  } catch (err) {
    console.error('Error updating note:', err.message);
    res.status(500).send('Server error');
  }
});

// POST /notes/:id/delete — delete the note
router.post('/:id/delete', isLoggedIn, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.redirect('/notes');
  } catch (err) {
    console.error('Error deleting note:', err.message);
    res.status(500).send('Server error');
  }
});

// GET /notes/:id — show a single note
router.get('/:id', isLoggedIn, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user.googleId }); // ✅ исправлено
    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!note) return res.status(404).send('Note not found');
    res.render('notes/show', { note, profile: userProfile });
  } catch (err) {
    console.error('Error fetching note:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
