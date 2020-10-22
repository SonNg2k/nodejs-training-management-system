const createError = require('http-errors')

module.exports = (app) => {
    process.on("unhandledRejection", (reason, _promise) => {
        //reason is usually the Error object
        console.log("Unhandled Rejection at:", reason.stack || reason)
        /* Recommended: send the information to sentry.io
        or whatever crash reporting service you use */
    })

    app.use(logErrors);
    app.use(errorHandler);
}

// const pe = new PrettyError();
// pe.skipNodeFiles();
// pe.skipPackage('express');

// declare the arrow functions instead of the old ones to circumvent hoisting-related problems:
const logErrors = (err, _req, _res, next) => {
    /* Basic console.log will not go through long and complex object, and may
    decide to just print [Object] instead. */
    console.dir(err, { depth: null }); // depth: null allows console.dir() to print mutiple objects at once
    // console.log(pe.render(err)); // eslint-disable-line no-console

    next(err)
}

const errorHandler = (err, _req, res, next) => {
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
