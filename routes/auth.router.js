const router = require('express').Router(),
    authController = require('../controllers/auth.controller')

router.post('/session', authController.returnJWT)

router.post('/refresh-token') // or /access-token

router.delete('/session')

module.exports = router
