const router = require('express').Router(),
    { authUser, authRole } = require('./utils/authFuncs'),
    assistantController = require('../controllers/assistant.controller')

router.get('/', authUser, authRole(['admin']), assistantController.listAssistants)

router.post('/', authUser, authRole(['admin']), assistantController.addAssistant)

router.put('/:id', authUser, authRole(['admin']), assistantController.editAssistant)

router.delete('/:id', authUser, authRole(['admin']), assistantController.deleteAssistant)

module.exports = router
