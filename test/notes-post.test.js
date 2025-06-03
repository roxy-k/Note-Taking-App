const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app');
const Note = require('../models/note');

chai.use(chaiHttp);

describe('Notes API - POST Endpoint', function () {
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockUser = { id: mockUserId, username: 'testuser' };

  beforeEach(async function () {
    app.request.user = mockUser;
    await Note.deleteMany({ owner: mockUserId });
  });

  it('should create a new note with valid data', function (done) {
    const newNote = {
      title: 'New Test Note',
      content: 'This is a test note created via API',
      category: 'API Testing'
    };

    chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('title', newNote.title);
        expect(res.body).to.have.property('content', newNote.content);
        expect(res.body).to.have.property('category', newNote.category);
        expect(res.body).to.have.property('owner', mockUserId);
        done();
      });
  });

  it('should return 400 when creating a note without required fields', function (done) {
    const invalidNote = {
      category: 'Missing title and content'
    };

    chai.request(app)
      .post('/api/notes')
      .send(invalidNote)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  afterEach(function () {
    delete app.request.user;
  });
});
