const chai = require('chai');
const chaiHttp = require
('chai-http');
const expect = chai.expect;
// Configure chai
chai.use(chaiHttp);
chai.should();
// Make chai available globally
global.chai = chai;
global.expect = expect;
// Import the app
const app = require('../app');
global.app = app;
// Before running tests
before(function() {
  console.log('Starting Notes API test suite');
});
// After running tests
after(function() {
  console.log('All Notes API tests completed');
});
