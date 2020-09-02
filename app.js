const express = require('express');
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
seedDB()

app.use(express.json());
app.use((req, res, next) => { // make "/path" and "/path/" to be the same
  const test = /\?[^]*\//.test(req.url);
  if (req.url.substr(-1) === "/" && req.url.length > 1 && !test)
    res.redirect(301, req.url.slice(0, -1));
  else next();
});

app.disable('x-powered-by'); // NOT reveal the technology of server (Express.js) to hackers

//requiring routes
// var routes = require("./routes")
// app.use("/", routes);
app.get("/category-management", () => {
  console.log("React made request")
})
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

function errorHandler(err, req, res, _next) {
  /*  If you call next() with an error after you have started writing the response (for example, if you
   encounter an error while streaming the response to the client) the Express default error handler
   closes the connection and fails the request. */
  /* So when you add a custom error handler, you must delegate to the default Express error handler, when
  the headers have already been sent to the client: */
  if (res.headersSent) return next(err); // default error handler can get triggered if you call next()
  // with an error in your code more than once, even if custom error handling middleware is in place.

  /*  422 Unprocessable Entity: the server understands the content type of the request entity, and the
 syntax of the request entity is correct, but it was unable to process the contained instructions.
 The server understands what you're trying to do; and it understands the data that you're submitting; it
 simply won't let that data be processed.
 For example: a user is sending a String to an API end point that expects a String, but the server
 couldn't process it because the string contains nothing or several unacceptable characters, etc.*/

  res.status(err.statusCode || 500)
  // http-errors: mirroring statusCode for general compatibility
}

function logErrors(err, req, res, next) {
  /* Basic console.log will not go through long and complex object, and may
  decide to just print [Object] instead. */
  console.dir(err, { depth: null }); // depth: null allows console.dir() to print mutiple objects at once
  next(err)
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API server is running on port: ${port}`);
});
