const router = require('express').Router(),
    { authUser, authRole } = require('./utils/authFuncs'),
    createError = require('http-errors'),
    User = require('../models/User'),
    Trainee = require('../models/Trainee')

router.get('/', authUser, authRole(['assistant', 'trainee']), (req, res, next) => {
    const { role, _id } = req.user
    let findCommand = Trainee.find({})
    if (role === 'trainee') findCommand = Trainee.findById(_id)
    findCommand
        .populate('basic_info', 'name email phone dob -_id')
        .populate('assigned_programs', '_id name')
        .select('-__v').lean().exec()
        .then((populated) => {
            if (!Array.isArray(populated)) populated = [populated]
            populated = populated.map((doc) => {
                const { _id: id, education, department, assigned_programs } = doc
                const basic_info = doc.basic_info
                const newDoc = {
                    _id: id, education: education, department: department, assigned_programs: assigned_programs,
                    ...basic_info
                }
                return newDoc
            })
            if (role === 'trainee') populated = populated[0]
            res.status(200).json(populated)
        })
        .catch(next)
})

router.post('/', authUser, authRole(['assistant']), (req, res, next) => {
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
                    res.status(200).json({ _id: traineeID })
                })
                .catch((err) => {
                    user.remove() // remove the info associated with the falsy trainee info
                    next(err)
                })
        })
        .catch(next)
})

// A logged in trainee can send his/her JWT to this route to update the profile
router.put(['/', '/:id'], authUser, authRole(['assistant', 'trainee']), (req, res, next) => {
    const { role, _id } = req.user
    let { body: data, params: { id } } = req
    if (role === 'trainee') id = _id

    let user = (({ name, email, password, phone, dob }) => ({ name, email, password, phone, dob }))(data)
    user.role = 'trainee'
    if (!user.password) delete user.password

    let traineeOnly = (({ education, department, assigned_programs }) => ({ education, department, assigned_programs }))(data)
    if (role === 'trainee') delete traineeOnly.assigned_programs // trainee is not allowed to update his/her programs

    Trainee.findByIdAndUpdate(id, traineeOnly, { new: true, runValidators: true })
        .then((trainee) => {
            if (!trainee) return next(createError.NotFound('There is no user with the given ID'))
            const { basic_info } = trainee
            User.findByIdAndUpdate(basic_info, user, { new: true, runValidators: true })
                .then(() => res.status(200).json('Operation completed successfully')).catch(next)
        })
        .catch(next)
})

router.delete('/:id', authUser, authRole(['assistant']), (req, res, next) => {
    let { params: { id } } = req
    Trainee.findByIdAndDelete(id)
        .then(({ basic_info }) =>
            User.findByIdAndDelete(basic_info)
                .then(() => res.status(200).json('Operation completed successfully')).catch(next))
        .catch(next)
})

module.exports = router
