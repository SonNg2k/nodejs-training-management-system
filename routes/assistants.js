const router = require('express').Router(),
    createError = require('http-errors'),
    { authUser, authRole } = require('./utils/authFuncs'),
    User = require('../models/User')

router.get('/', authUser, authRole(['admin']), (_req, res, next) => {
    User.find({ role: 'assistant' }).select('-role -person_id -password -__v').lean()
        .then((data) => res.status(200).json(data))
        .catch(next)
})

router.post('/', authUser, authRole(['admin']), (req, res, next) => {
    let { body: assistant } = req
    assistant.role = 'assistant'
    User.create(assistant)
        .then(({ _id: assistantID }) => res.status(201).json({ _id: assistantID }))
        .catch(next)
})

router.put('/:id', authUser, authRole(['admin']), (req, res, next) => {
    let { body: assistant, params: { id } } = req
    assistant.role = 'assistant'
    User.findByIdAndUpdate(id, assistant, { new: true, runValidators: true })
        .then((found) => {
            if (!found) return next(createError.NotFound('There is no user with the given ID'))
            res.status(200).json('Operation completed successfully')
        })
        .catch(next)
})

router.delete('/:id', authUser, authRole(['admin']), (req, res, next) => {
    let { params: { id } } = req
    User.findByIdAndDelete(id)
        .then((found) => {
            if (!found) return next(createError.NotFound('There is no user with the given ID'))
            res.status(200).json('Operation completed successfully')
        })
        .catch(next)
})

module.exports = router
