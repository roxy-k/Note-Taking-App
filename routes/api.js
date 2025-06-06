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
    const filter = { owner: req.user._id };

    if (req.query.category) {
      filter.category = req.query.category;
    }
    const notes = await Note.find(filter);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});
router.get('/notes/:id', isLoggedIn, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note || note.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch note' });
  }
});
// ✅ POST /api/notes 
router.post('/notes', isLoggedIn, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = await Note.create({
      title,
      content,
      category: category || '',
      owner: req.user.id
    });

    res.status(201).json(note);
  } catch (err) {
    console.error('POST error:', err.message);
    res.status(500).json({ error: 'Failed to create note' });
  }
});


module.exports = router;
