const jwt = require('jsonwebtoken'),
    createError = require('http-errors')

exports.authUser = (req, _res, next) => {
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

exports.authRole = (roles) => { // 'roles' is an array that specifies which role can be proceeded
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return res.status(403).json('You are not authorized')
        next()
    }
}
