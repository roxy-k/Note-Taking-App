const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
}

// GET /api/notes — return all notes for the user in JSON
router.get('/notes', isLoggedIn, async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user._id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes — create a new note via JSON API
router.post('/notes', isLoggedIn, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const newNote = new Note({
      title,
      content,
      category,
      owner: req.user._id
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

module.exports = router;
