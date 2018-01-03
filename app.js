const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: 'variables.env' })
}

mongoose.connect(process.env.DATABASE)
mongoose.Promise = global.Promise
mongoose.connection.on('error', (err) => {
  console.log(`Error connecting to the DB: ${err.message}`)
})

require('./models/User');

const { isLogged } = require('./middlewares');
const { catchErrors, errorHandler } = require('./handlers/errorHandlers');
const authController = require('./controllers/authController');
const weatherController = require('./controllers/weatherController');

const apiRoutes = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json('Welcome to our awsome api')
});

apiRoutes.get('/', (req, res) => {
  res.json('Welcome to our awsome api')  
})

apiRoutes.post('/auth', catchErrors(authController.login));
apiRoutes.get('/get-capital-weather', isLogged, catchErrors(weatherController.getWeather));

app.use(errorHandler)

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

module.exports = app;
