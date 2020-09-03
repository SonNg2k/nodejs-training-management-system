const router = require("express").Router(),
    Session = require('../models/Session')

// Verify login credentials
router.post("/")
router.get('/sessions', (_req, res, next) =>
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
