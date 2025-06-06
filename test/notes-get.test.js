const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const app = require('../app');
const Note = require('../models/note');
const User = require('../models/user');

chai.use(chaiHttp);

describe('Notes API - GET Endpoints', function () {
  let mockUser;
  let agent = chai.request.agent(app); 
  beforeEach(async function () {
  
    await User.deleteMany({});
    const googleId = new mongoose.Types.ObjectId().toString();

    mockUser = await User.create({
      googleId,
      email: `test${Date.now()}@example.com`,
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg'
    });


    app.request.user = mockUser;

   
    await Note.deleteMany({ owner: mockUser._id });
  });

  afterEach(() => {
    if (app.request.user) delete app.request.user;
  });

  it('should get all notes for a user', function (done) {
    agent
      .get('/api/notes')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

 
});
