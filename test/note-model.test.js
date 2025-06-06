const { expect } = require('chai');
const Note = require('../models/note'); 
const mongoose = require('mongoose');

describe('Note Model', function() {

  const mockUserId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

  const noteData = {
    title: 'Test Note',
    content: 'This is a test note',
    category: 'Testing',
    owner: mockUserId
  };
  
  it('should create a new note with valid data', function() {
    const note = new Note(noteData);
    expect(note).to.have.property('title').equal('Test Note');
    expect(note).to.have.property('content').equal('This is a test note');
    expect(note).to.have.property('category').equal('Testing');
    expect(note.owner.toString()).to.equal(mockUserId.toString()); 
    expect(note).to.have.property('createdAt');
  });
  
  it('should fail validation when title is missing', function() {
    const invalidNote = new Note({
      content: 'Note without title',
      owner: mockUserId
    });
    
    const validationError = invalidNote.validateSync();
    expect(validationError.errors.title).to.exist;
  });

  it('should fail validation when content is missing', function() {
    const invalidNote = new Note({
      title: 'Note without content',
      owner: mockUserId
    });
    const validationError = invalidNote.validateSync();
    expect(validationError.errors.content).to.exist;
  });

  it('should use default empty string when category is not provided', function() {
    const noteWithoutCategory = new Note({
      title: 'Note without category',
      content: 'This note has no category',
      owner: mockUserId
    });
    expect(noteWithoutCategory.category).to.equal('');
    expect(noteWithoutCategory).to.have.property('createdAt');
  });
});
