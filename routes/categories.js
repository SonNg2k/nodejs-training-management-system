const router = require('express').Router(),
    createError = require('http-errors'),
    { authUser, authRole } = require('./utils/authFuncs'),
    Category = require('../models/Category')

router.get('/', authUser, authRole(['assistant']), (_req, res, next) => {
    Category.find({}).select('-__v').lean()
        .then((data) => res.status(200).json(data))
        .catch(next)
})

router.post('/', authUser, authRole(['assistant']), (req, res, next) => {
    let { body: category } = req
    Category.create(category)
        .then(({ _id: categoryID }) => res.status(201).json({ _id: categoryID }))
        .catch(next)
})

router.put('/:id', authUser, authRole(['assistant']), (req, res, next) => {
    let { body: category, params: { id } } = req
    Category.findByIdAndUpdate(id, category, { new: true, runValidators: true })
        .then((found) => {
            if (!found) return next(createError.NotFound('There is no category with the given ID'))
            res.status(200).json('Operation completed successfully')
        })
        .catch(next)
})

router.delete('/:id', authUser, authRole(['assistant']), (req, res, next) => {
    let { params: { id } } = req
    Category.findByIdAndDelete(id)
        .then((found) => {
            if (!found) return next(createError.NotFound('There is no category with the given ID'))
            res.status(200).json('Operation completed successfully')
        })
        .catch(next)
})

module.exports = router
