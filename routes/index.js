var router = require("express").Router()

// Verify login credentials
router.post("/")
router.get('/sessions')

// Assemble other routes...
router.use('/assistants', require('./assistants'))
router.use('/trainers', require('./trainers'))
router.use('/trainees', require('./trainees'))
router.use('/categories', require('./categories'))
router.use('/programs', require('./programs'))

module.exports = router
