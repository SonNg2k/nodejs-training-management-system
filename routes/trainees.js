const router = require('express').Router(),
    User = require('../models/User'),
    Trainee = require('../models/Trainee'),
    createError = require('http-errors')

router.get('/', (_req, res, next) => {
    Trainee.find({})
        .populate('basic_info', 'name email phone dob')
        .populate('assigned_programs', '_id name')
        .select('-__v').lean().exec()
        .then((populated) => {
            populated = populated.map((doc) => {
                const { _id: id, education, department, assigned_programs } = doc
                const basic_info = doc.basic_info
                const newDoc = {
                    _id: id, education: education, department: department, assigned_programs: assigned_programs,
                    ...basic_info
                }
                return newDoc
            })
            res.status(200).json(populated)
        })
        .catch(next)
})

router.post('/', (req, res, next) => {
    let { body: data } = req
    let user = (({ name, email, password, phone, dob }) => ({ name, email, password, phone, dob }))(data)
    user.role = 'trainee'

    let traineeOnly = (({ education, department, assigned_programs }) => ({ education, department, assigned_programs }))(data)
    User.create(user)
        .then((user) => {
            let { _id: userID } = user
            traineeOnly.basic_info = userID
            Trainee.create(traineeOnly)
                .then(({ _id: traineeID }) => {
                    user.person_id = traineeID
                    user.save()
                    res.status(200).json('Operation completed successfully')
                })
                .catch((err) => {
                    user.remove() // remove the info associated with the falsy trainee info
                    next(err)
                })
        })
        .catch(next)
})

router.put('/:id', (req, res, next) => {
    let { body: data, params: { id } } = req
    let user = (({ name, email, password, phone, dob }) => ({ name, email, password, phone, dob }))(data)
    user.role = 'trainee'
    if (!user.password) delete user.password

    let traineeOnly = (({ education, department, assigned_programs }) => ({ education, department, assigned_programs }))(data)
    Trainee.findByIdAndUpdate(id, traineeOnly, { new: true, runValidators: true })
        .then((trainee) => {
            if (!trainee) return next(createError.NotFound('There is no user with the given ID'))
            const { basic_info } = trainee
            User.findByIdAndUpdate(basic_info, user, { new: true, runValidators: true })
                .then(() => res.status(200).json('Operation completed successfully')).catch(next)
        })
        .catch(next)
})

router.delete('/:id', (req, res, next) => {
    let { params: { id } } = req
    Trainee.findByIdAndDelete(id)
        .then(({ basic_info }) =>
            User.findByIdAndDelete(basic_info)
                .then(() => res.status(200).json('Operation completed successfully')).catch(next))
        .catch(next)
})

module.exports = router
