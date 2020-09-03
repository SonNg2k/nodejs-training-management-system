const router = require('express').Router(),
    User = require('../models/User'),
    Trainer = require('../models/Trainer'),
    createError = require('http-errors')

router.get('/', (_req, res, next) => {
    Trainer.find({})
        .populate('basic_info', 'name email phone dob')
        .populate('assigned_sessions', '_id name') // only _id and session name is enough
        .select('-__v').lean().exec()
        .then((populated) => {
            populated = populated.map((doc) => {
                const { _id, type, working_place, assigned_sessions } = doc
                const basic_info = doc.basic_info
                const newDoc = {
                    _id: _id, type: type, working_place: working_place, assigned_sessions: assigned_sessions,
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
                    res.status(200).json('Operation completed successfully')
                })
                .catch((err) => {
                    user.remove() // remove the info associated with the falsy trainer info
                    next(err)
                })
        })
        .catch(next)
})

router.put('/:id', (req, res, next) => {
    let { body: data, params: { id } } = req
    let user = (({ name, email, password, phone, dob }) => ({ name, email, password, phone, dob }))(data)
    user.role = 'trainer'
    if (!user.password) delete user.password

    let trainerOnly = (({ type, working_place, assigned_sessions }) => ({ type, working_place, assigned_sessions }))(data)
    Trainer.findByIdAndUpdate(id, trainerOnly, { new: true, runValidators: true })
        .then((trainer) => {
            if (!trainer) return next(createError.NotFound('There is no user with the given ID'))
            const { basic_info } = trainer
            User.findByIdAndUpdate(basic_info, user, { new: true, runValidators: true })
                .then(() => res.status(200).json('Operation completed successfully')).catch(next)
        })
        .catch(next)
})

router.delete('/:id', (req, res, next) => {
    let { params: { id } } = req
    Trainer.findByIdAndDelete(id)
        .then(({ basic_info }) =>
            User.findByIdAndDelete(basic_info)
                .then(() => res.status(200).json('Operation completed successfully')).catch(next))
        .catch(next)
})

module.exports = router
