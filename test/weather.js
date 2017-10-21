const mongoose = require("mongoose");
const User = require('../models/User');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const expect = chai.expect;
const { createJWT } = require('../helpers')

chai.use(chaiHttp);

describe('/GET weather', () => {
  it('it should return the weather of Rome', async (done) => {
    const user = await User.findOne({ email: 'test@test.com' });
    const token = createJWT(user.token)
    chai.request(server)
      .get(`/api/get-capital-weather/?token=${token}&countries=["italy"]`)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('array')
        expect(res.body[0]).to.deep.include({ capital: "Rome" })
        done()
      })
  })
});
