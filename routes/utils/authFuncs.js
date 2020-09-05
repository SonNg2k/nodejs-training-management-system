const jwt = require('jsonwebtoken'),
    createError = require('http-errors')

exports.authenticate = (req, res, next) => {
    const loginError = createError.Unauthorized('You are not logged in')
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return next(loginError)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return next(loginError)
        req.user = user
        next()
    })
}

exports.authorize = (req, res, next) => {

}
