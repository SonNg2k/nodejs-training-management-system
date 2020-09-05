const router = require('express').Router(),
    { authUser, authRole } = require('./utils/authFuncs'),
    createError = require('http-errors'),
    User = require('../models/User'),
    Trainer = require('../models/Trainer')

router.get('/', authUser, authRole(['admin', 'assistant', 'trainer']), (req, res, next) => {
    const { role, _id } = req.user
    let findCommand = Trainer.find({})
    if (role === 'trainer') findCommand = Trainer.findById(_id)
    findCommand
        .populate('basic_info', 'name email phone dob -_id')
        .populate('assigned_sessions', '_id name') // only _id and session name is enough
        .select('-__v').lean().exec()
        .then((populated) => {
            if (!Array.isArray(populated)) populated = [populated]
            populated = populated.map((doc) => {
                const { _id, type, working_place, assigned_sessions } = doc
                const basic_info = doc.basic_info
                const newDoc = {
                    _id: _id, type: type, working_place: working_place, assigned_sessions: assigned_sessions,
                    ...basic_info
                }
                return newDoc
            })
            if (role === 'trainer') populated = populated[0]
            res.status(200).json(populated)
        })
        .catch(next)
})

router.post('/', authUser, authRole(['admin', 'assistant']), (req, res, next) => {
    let { body: data } = req
    let user = (({ name, email, password, phone, dob }) => ({ name, email, password, phone, dob }))(data)
    user.role = 'trainer'

    let trainerOnly = (({ type, working_place, assigned_sessions }) => ({ type, working_place, assigned_sessions }))(data)
    User.create(user)
        .then((user) => {
            let { _id: userID } = user
            trainerOnly.basic_info = userID
            Trainer.create(trainerOnly)
                .then(({ _id: trainerID }) => {
                    user.person_id = trainerID
                    user.save()
                    res.status(200).json({ _id: trainerID })
                })
                .catch((err) => {
                    user.remove() // remove the info associated with the falsy trainer info
                    next(err)
                })
        })
        .catch(next)
})

// A logged in trainer can send the JWT to this route to update the profile
router.put(['/', '/:id'], authUser, authRole(['admin', 'assistant', 'trainer']), (req, res, next) => {
    const { role, _id } = req.user
    let { body: data, params: { id } } = req
    if (role === 'trainer') id = _id

    let user = (({ name, email, password, phone, dob }) => ({ name, email, password, phone, dob }))(data)
    user.role = 'trainer'
    if (!user.password) delete user.password

    let trainerOnly = (({ type, working_place, assigned_sessions }) => ({ type, working_place, assigned_sessions }))(data)
    if (role === 'trainer') delete trainerOnly.assigned_sessions // trainer is not allowed to update his/her sessions

    Trainer.findByIdAndUpdate(id, trainerOnly, { new: true, runValidators: true })
        .then((trainer) => {
            if (!trainer) return next(createError.NotFound('There is no user with the given ID'))
            const { basic_info } = trainer
            User.findByIdAndUpdate(basic_info, user, { new: true, runValidators: true })
                .then(() => res.status(200).json('Operation completed successfully')).catch(next)
        })
        .catch(next)
})

router.delete('/:id', authUser, authRole(['admin', 'assistant']), (req, res, next) => {
    let { params: { id } } = req
    Trainer.findByIdAndDelete(id)
        .then(({ basic_info }) =>
            User.findByIdAndDelete(basic_info)
                .then(() => res.status(200).json('Operation completed successfully')).catch(next))
        .catch(next)
})

module.exports = router
