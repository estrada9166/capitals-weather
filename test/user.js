const mongoose = require("mongoose");
const User = require('../models/User');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('User', () => {
  describe('/POST auth a user', () => {
    it('it should auth a user', (done) => {
      const user = new User({ email: 'test@test.com', password: 'test' })
      const logData = { email: 'test@test.com', password: 'test'}
      user.save((err, user) => {
        chai.request(server)
          .post('/api/auth')
          .send(logData)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')  
            res.body.should.have.property('token')          
            done()
          })
      })
    })
  });

  describe('/GET weather with fake token', () => {
    it('it should not get the weather with an invalid token', (done) => {
      chai.request(server)
        .get('/api/get-capital-weather/?token=123&countires=[Colombia]')
        .end((err, res) => {
          res.should.have.status(401)
          done()
        })
    })
  });
})
