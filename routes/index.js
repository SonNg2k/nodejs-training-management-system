const router = require("express").Router(),
    { authUser, authRole } = require('./utils/authFuncs'),
    Session = require('../models/Session')

// return a list of sessions
router.get('/sessions', authUser, authRole(['admin', 'assistant']), (_req, res, next) =>
    Session.find({}).select('_id name').lean()
        .then((data) => res.status(200).json(data))
        .catch(next)
)

// Assemble other routes...
router.use('/assistants', require('./assistant.router'))
router.use('/categories', require('./category.router'))
router.use('/programs', require('./program.router'))
router.use('/auth', require('./auth.router'))

module.exports = router
