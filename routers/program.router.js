const router = require('express').Router(),
    { authUser, authRole } = require('./utils/authFuncs'),
    programController = require('../controllers/program.controller')

router.get('/', authUser, authRole(['assistant']), programController.listPrograms)

router.post('/', authUser, authRole(['assistant']), programController.addProgram)

router.put('/:id', authUser, authRole(['assistant']), programController.editProgram)

router.delete('/:id', authUser, authRole(['assistant']), programController.deleteProgram)

module.exports = router
