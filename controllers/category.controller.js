const createError = require('http-errors'),
    Category = require('../models/Category')

const listCategories = (_req, res, next) => {
    Category.find({}).select('-__v').lean()
        .then((data) => res.status(200).json(data))
        .catch(next)
}

const addCategory = (req, res, next) => {
    let { body: category } = req
    Category.create(category)
        .then(({ _id: categoryID }) => res.status(201).json({ _id: categoryID }))
        .catch(next)
}

const editCategory = (req, res, next) => {
    let { body: category, params: { id } } = req
    Category.findByIdAndUpdate(id, category, { new: true, runValidators: true })
        .then((found) => {
            if (!found) return next(createError.NotFound('There is no category with the given ID'))
            res.status(200).json('Operation completed successfully')
        })
        .catch(next)
}

const deleteCategory = (req, res, next) => {
    let { params: { id } } = req
    Category.findByIdAndDelete(id)
        .then((found) => {
            if (!found) return next(createError.NotFound('There is no category with the given ID'))
            res.status(200).json('Operation completed successfully')
        })
        .catch(next)
}

module.exports = { listCategories, addCategory, editCategory, deleteCategory }
