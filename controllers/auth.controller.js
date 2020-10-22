const User = require('../models/User'),
    jwt = require('jsonwebtoken'),
    createError = require('http-errors'),

const returnJWT = (req, res, next) => {
    const { body: { email, password } } = req
    const loginError = createError.Unauthorized('Invalid login credentials')
    User.find({ email: email })
        .then(([user]) => {
            if (!user) return next(loginError)
            user.isCorrectPassword(password)
                .then(result => {
                    if (!result) return next(loginError)
                    const { role, _id, person_id } = user
                    const idToAssign = {
                        assistant: _id,
                        trainer: person_id,
                        trainee: person_id
                    }
                    const payload = { role: role, _id: idToAssign[role] }
                    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
                    res.status(200).json({ role: role, token: token })
                })
                .catch(next)
        })
        .catch(next)
}

module.exports = { returnJWT }
