const jwt = require('jsonwebtoken'),
    createError = require('http-errors'),
    bcrypt = require('bcrypt')

exports.authAdmin = (req, res, next) => {
    const { body: { email, password } } = req
    const loginError = createError.Unauthorized('Invalid login credentials')
    if (email === 'superadmin@gmail.com') {
        bcrypt.compare(password, process.env.ADMIN_HASHED_PASSWORD)
            .then(result => {
                if (!result) return next(loginError)
                const token = jwt.sign({ role: 'admin' }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
                res.status(200).json({ role: 'admin', token: token })
            })
    }
    else next()
}

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
