const createError = require('http-errors'),
    User = require('../models/User')

const listAssistants = (_req, res, next) => {
    User.find({ role: 'assistant' }).select('-role -person_id -password -__v').lean()
        .then((data) => res.status(200).json(data))
        .catch(next)
}

const addAssistant = (req, res, next) => {
    let { body: assistant } = req
    assistant.role = 'assistant'
    User.create(assistant)
        .then(({ _id: assistantID }) => res.status(201).json({ _id: assistantID }))
        .catch(next)
}

const editAssistant = (req, res, next) => {
    let { body: assistant, params: { id } } = req
    assistant.role = 'assistant'
    User.findByIdAndUpdate(id, assistant, { new: true, runValidators: true })
        .then((found) => {
            if (!found) return next(createError.NotFound('There is no user with the given ID'))
            res.status(200).json('Operation completed successfully')
        })
        .catch(next)
}

const deleteAssistant = (req, res, next) => {
    let { params: { id } } = req
    User.findByIdAndDelete(id)
        .then((found) => {
            if (!found) return next(createError.NotFound('There is no user with the given ID'))
            res.status(200).json('Operation completed successfully')
        })
        .catch(next)
}

module.exports = { listAssistants, addAssistant, editAssistant, deleteAssistant }
