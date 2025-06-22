const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Transaction Routes (/api/transactions)', () => {
  let authTokenAdmin = '';
  let authTokenUser = '';
  let createdTransactionId = '';
  let testUserId = '';
  let authTokenUser1 = '';
  

  before(function (done){
      this.timeout(10000);
    // Log in as admin
    chai.request(app)
      .post('/api/user/login')
      .send({ email: 'lara.admin@example.com', password: 'AdminClara789!' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        authTokenAdmin = res.body.token;

        // Log in as regular user (you can register one if needed)
        chai.request(app)
          .post('/api/user/login')
          .send({ email: 'bosco@example.com', password: 'BoscoPass456' }) 
          .end((err2, res2) => {
            expect(res2).to.have.status(200);
            authTokenUser = res2.body.token;
            testUserId = res2.body.user?.id || ''; // depends on your login response
             chai.request(app)
              .post('/api/user/login')
              .send({ email: 'georgeadmin@example.com', password: 'password123' }) 
              .end((err2, res2) => {
                expect(res2).to.have.status(200);
                authTokenUser1 = res2.body.token;
                testUserId1 = res2.body.user?.id || ''; // depends on your login response
                done();
          });
          });
      });
  });

  it('POST /api/transactions - user creates a new transaction', (done) => {
    chai.request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${authTokenUser}`)
      .send({}) // no amount here, user initiates with amount=0 in your controller
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('transaction');
        expect(res.body.transaction).to.have.property('status', 'pending');
        createdTransactionId = res.body.transaction._id;
        done();
      });
  });

  it('GET /api/transactions/my - user fetches their transactions', (done) => {
    chai.request(app)
      .get('/api/transactions/my')
      .set('Authorization', `Bearer ${authTokenUser}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });


  it('PUT /api/transactions/:id/approve - admin approves transaction', (done) => {
    chai.request(app)
      .put(`/api/transactions/${createdTransactionId}/approve`)
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .send({ amount: 1000 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.transaction).to.have.property('status', 'success');
        expect(res.body.transaction).to.have.property('amount', 1000);
        done();
      });
  });

 it('PUT /api/transactions/:id/reject - admin rejects a transaction', (done) => {
  chai.request(app)
    .post('/api/transactions')
    .set('Authorization', `Bearer ${authTokenUser1}`)
    .send({})
    .end((err, res) => {
      if (err) return done(err);


      if (!res.body.transaction || !res.body.transaction._id) {
        return done(new Error('Transaction was not created successfully'));
      }

      const txIdToReject = res.body.transaction._id;

      chai.request(app)
        .put(`/api/transactions/${txIdToReject}/reject`)
        .set('Authorization', `Bearer ${authTokenAdmin}`)
        .end((err2, res2) => {
          if (err2) return done(err2);


          expect(res2).to.have.status(200);
          expect(res2.body.transaction).to.have.property('status', 'rejected');
          done();
        });
    });
});


  it('DELETE /api/transactions/user/:userId - admin deletes all transactions of a user', (done) => {
    chai.request(app)
      .delete(`/api/transactions/user/${testUserId}`)
      .set('Authorization', `Bearer ${authTokenAdmin}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('deletedCount').that.is.a('number');
        done();
      });
  });
});
