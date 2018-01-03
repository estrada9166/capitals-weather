# Capital weather

## How it works

```bash
$ git clone
$ npm install
$ npm start
```
### Variables
Remove `e.g` from the `variables.env.eg` file
+ Add your database, in this case I'm using mongodb
+ Add your [open weather map API key](openweathermap.org)

### Create User
To create a new user on the data base just run
```bash
$ node createUser.js
```
It will ask for an email an a password to create the user on the databe

### Run test
Run on the console
```bash
$ npm test
```
In this case I'm using Mocha and Chai to run 3 different tests where it will auth a user,
response 401 whent the token is not valid and return the weather of Rome.

## Endpoints

### POST /auth
This endpoint will recieve an email and a password; after recieve it the first thing to do is to get the info of the user using mongoose `findOne({ email })`. Because this is an `async/await` method we'll waith the response of the `db`, if the user doesn't exists we will response with a `401` that means `UNAUTHORIZED`, in case that the user exists we will check with the property of bcrypt `compare` if the actual password match with the hash stored on the `db` in case that not we will response with a `401` again, and if it is true we will update the token stored on the `db` and response with a json that has a `JWT`

### GET /get-capital-weather
This is an `async/await` method that will have a middleware that is called `isLogged`, the main purpose of this middleware is to check what the name says... it will check if a token is passed (by `req.query` or `req.body`), then we will check if this token is a valid token verifying it with `JWT`in case that yes, we will search on the `db` the user with the token decrypted by the `JWT` and set the id to `res.locals.userId` so we can use it latter in case we need it. If it is not a valid token we will response with a `401` that means `UNAUTHORIZED`. After checking if the token is valid we will continue with our route that will get an array of countries and for each one we will make a request to get the capital... in this case we are going to use `request-promise` and push it to an array... as the name says we are having an array of promises so we can make multiples request at the time and wait to resolve all of them using `Promise.all()` in case that theres an invalid country we are going to push to the array a `null` value to filter it easy on the next step. We are going to repeat this process with the valid capitals, making multiple request to get the weather, but before that we must clean the `str` so this request can get the real city (e.g: in the case of Bogotá). To finish we will create a new array with some objects that are going to have the capital name and the weather.

e.g `http://localhost:7777/api/get-capital-weather/?token=<TOKEN>&countries=["italy", "Colombia", "Brazil", "Argentina"]`

### VARIABLES.ENV
This is just for development, in production all variables should be pass at process launch time or should be set as regular enviroment variables.
```
DATABASE=mongodb://<Username>:<Password>@ds127105.mlab.com:27105/capital-weather
JWTKEY=super_secret_key
TOKEN=<OPEN_WEATHER_MAP_API_KEY>
```
### License
The MIT License
Copyright (c) 2017 Alejandro Estrada

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.