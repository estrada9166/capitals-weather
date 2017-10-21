const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { createJWT, randomString } = require('./helpers');
const readline = require('readline');
require('dotenv').config({ path: 'variables.env' });
require('./models/User');

mongoose.connect(process.env.DATABASE)
mongoose.Promise = global.Promise
mongoose.connection.on('error', (err) => {
  console.log(`Error connecting to the DB: ${err.message}`)
})

const User = mongoose.model('User');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class UserService {
  constructor() {
    this.user = {
      email: null,
      password: null
    }
  }

  getEmail()  {
    const re = /\S+@\S+\.\S+/;
    rl.question('Email: ', (answer) => {
      if (!re.test(answer)) {
        console.log('Invalid email');
        this.getEmail();
      }
      this.user.email = answer;
      this.getPassword()
    });
  }

  getPassword() {
    rl.question('Password: ', (answer) => {
      this.user.password = answer;
      this.createUser()
    });
  }

  async createUser () {
    const { email, password } = this.user
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      const token = randomString()
      const user = await (new User({ email, token, password: hash })).save();
      console.log('Successfully create user:', user)
      process.exit()
    } catch (err) {
      const errors = [];  
      const errorKeys = Object.keys(err.errors);
      errorKeys.forEach(key => errors.push(err.errors[key].message));
      console.log(errors);
      process.exit();
    }
  }
}

const NewUser = new UserService();
NewUser.getEmail();
