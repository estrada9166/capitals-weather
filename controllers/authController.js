const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const { createJWT, randomString } = require('../helpers');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email })
  if (!user) {
    res.sendStatus(401);
    return;
  }
  const validatePassword = await bcrypt.compare(password, user.password)
  if (!validatePassword) {
    res.sendStatus(401);
    return;    
  }
  const token = randomString();
  await User.findOneAndUpdate({ email }, { token }).exec();
  res.json({ success: true, token: createJWT(token) });  
}
