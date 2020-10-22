const router = require('express').Router(),
    { authUser, authRole } = require('./utils/authFuncs'),
    categoryController = require('../controllers/category.controller')

router.get('/', authUser, authRole(['assistant']), categoryController.listCategories)

router.post('/', authUser, authRole(['assistant']), categoryController.addCategory)

router.put('/:id', authUser, authRole(['assistant']), categoryController.editCategory)

router.delete('/:id', authUser, authRole(['assistant']), categoryController.deleteCategory)

module.exports = router
