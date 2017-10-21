const mongoose = require('mongoose');
const User = mongoose.model('User');
const { verifyJWT } = require('./helpers');

exports.isLogged = async (req, res, next) => {
  try {
    const token = req.query.token || req.body.token
    const userToken = await verifyJWT(token)
    const user = await User.findOne({ token: userToken.userInfo });
    res.locals.userId = user._id
    next()
  } catch (err) {
    res.sendStatus(401);
    return;
  }
}
