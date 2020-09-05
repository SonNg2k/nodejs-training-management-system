const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const createError = require('http-errors')

const seedDB = require('./seedDB')

require('dotenv').config();

const app = express();

const uri = process.env.ATLAS_URI || 'mongodb://localhost/FPT-DB';
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})
// seedDB()

app.use(express.static(path.resolve(__dirname, './client/build')))
app.use(express.json());
app.use((req, res, next) => { // make "/path" and "/path/" to be the same
  const test = /\?[^]*\//.test(req.url);
  if (req.url.substr(-1) === "/" && req.url.length > 1 && !test)
    res.redirect(301, req.url.slice(0, -1));
  else next();
});

app.disable('x-powered-by'); // NOT reveal the technology of server (Express.js) to hackers

//requiring routes
var routes = require('./routes')
app.use("/", routes);
app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, './client/build', 'index.html')));
app.all("*", (req, _res, next) => {
  next(new createError.NotFound(`Page not found. ${req.ip} tried to reach ${req.originalUrl}`))
})

process.on("unhandledRejection", (reason, promise) => {
  //reason is usually the Error object
  console.log("Unhandled Rejection at:", reason.stack || reason)
  /* Recommended: send the information to sentry.io
  or whatever crash reporting service you use */
})

// Error handling
app.use(logErrors);
app.use(errorHandler);

function logErrors(err, _req, _res, next) {
  /* Basic console.log will not go through long and complex object, and may
  decide to just print [Object] instead. */
  console.dir(err, { depth: null }); // depth: null allows console.dir() to print mutiple objects at once
  next(err)
}

function errorHandler(err, _req, res, next) {
  if (res.headersSent) return next(err);

  const dupKeyErrMsg = { // error msg for duplicate key in DB
    users: 'There is already a user with this email',
    categories: 'The category has already exited',
    programs: 'The program name has already exited'
  }

  // Loop through each key of the object
  // for each key, check if
  let { code, message: errMsg } = err

  if (code === 11000) { // MongoDB dup key error
    Object.keys(dupKeyErrMsg).forEach((collection) => {
      if (errMsg.includes(collection)) errMsg = dupKeyErrMsg[collection]
    })
    err = createError.UnprocessableEntity(errMsg)
  }

  if (!err.statusCode) err = createError.InternalServerError('Unknown error, sorry')
  // All errors are http errors with status code and message
  let { statusCode, message } = err
  res.status(statusCode).json(message)
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`API server is running on port: ${port}`);
});
