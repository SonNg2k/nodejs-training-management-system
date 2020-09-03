const router = require('express').Router(),
    createError = require('http-errors'),
    Category = require('../models/Category')

router.get('/', (_req, res, next) => {
    Category.find({}).select('-__v').lean()
        .then((data) => res.status(200).json(data))
        .catch(next)
})

router.post('/', (req, res, next) => {
    let { body: category } = req
    Category.create(category)
        .then(() => res.status(201).json('Operation completed successfully'))
        .catch(next)
})

router.put('/:id', async (req, res, next) => {
    let { body: category, params: { id } } = req
    Category.findByIdAndUpdate(id, category, { new: true, runValidators: true })
        .then((found) => {
            if (!found) return next(createError.NotFound('There is no category with the given ID'))
            res.status(200).json('Operation completed successfully')
        })
        .catch(next)
})

router.delete('/:id', (req, res, next) => {
    let { params: { id } } = req
    Category.findByIdAndDelete(id)
        .then((found) => {
            if (!found) return next(createError.NotFound('There is no category with the given ID'))
            res.status(200).json('Operation completed successfully')
        })
        .catch(next)
})

module.exports = router
