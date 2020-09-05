const router = require("express").Router(),
    jwt = require('jsonwebtoken'),
    createError = require('http-errors'),
    { authUser, authRole } = require('./utils/authFuncs'),
    User = require('../models/User'),
    Session = require('../models/Session')

// User must enter the login credentials at root / so that they can gain access
router.post("/", (req, res, next) => {
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
                    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
                    res.status(200).json({ role: role, token: token })
                })
                .catch(next)
        })
        .catch()
})

// return a list of sessions
router.get('/sessions', authUser, authRole(['admin', 'assistant']), (_req, res, next) =>
    Session.find({}).select('_id name').lean()
        .then((data) => res.status(200).json(data))
        .catch(next)
)

// Assemble other routes...
router.use('/assistants', require('./assistants'))
router.use('/trainers', require('./trainers'))
router.use('/trainees', require('./trainees'))
router.use('/categories', require('./categories'))
router.use('/programs', require('./programs'))

module.exports = router
