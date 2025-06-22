const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Adjust as needed
const expect = chai.expect;
const path = require('path');

chai.use(chaiHttp); // ✅ Now this will work

describe('User Routes (/api/user)', function(){
      this.timeout(20000);
  let authToken = '';
  let createdUserId = '';

  // Register a new user (needed for login and other tests)
 it('POST /register - should register a new user', (done) => {
  chai.request(app)
    .post('/api/user/register')
    .field('email', 'testuser@example.com')
    .field('password', 'password123')
    .field('name', 'Test User')
    .field('nationalID', '1199999999999999')
    .field('dob', '1995-01-01')
    .field('role', 'user') // or 'admin' if that's valid
    .attach('image', path.resolve(__dirname, 'test.png'))
    .end((err, res) => {
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('user');
      createdUserId = res.body.user._id;
      done();
    });
});

  // Login user to get auth token
  it('POST /login - should login user and return token', (done) => {
    chai.request(app)
      .post('/api/user/login')
      .send({ email: 'lara.admin@example.com', password: 'AdminClara789!' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        authToken = res.body.token;
        done();
      });
  });

  // Get all users (requires admin token)
  it('GET / - should get all users (admin only)', (done) => {
    chai.request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${authToken}`) 
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // Get user profile by ID (requires auth)
  it('GET /:id - should get user profile by id', (done) => {
    chai.request(app)
      .get(`/api/user/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id').equal(createdUserId);
        done();
      });
  });

  // Update user info (requires admin auth)
  it('PUT /:id - should update user info', (done) => {
    chai.request(app)
      .put(`/api/user/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Updated Test User' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name').equal('Updated Test User');
        done();
      });
  });

  // Delete user (admin only)
  it('DELETE /:id - should delete user', (done) => {
    chai.request(app)
      .delete(`/api/user/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

});
