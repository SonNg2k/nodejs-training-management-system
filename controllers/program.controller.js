const Program = require('../models/Program'),
    Session = require('../models/Session'),
    createError = require('http-errors')

const listPrograms = (_req, res, next) => {
    Program.find({}).populate('sessions', '-programID -__v')
        .populate('category', '-desc -__v')
        .select('-__v').lean().exec()
        .then((data) => res.status(200).json(data))
        .catch(next)
}

const addProgram = (req, res, next) => {
    const { body: data } = req
    let programNoSession = (({ name, desc, category }) => ({ name, desc, category }))(data)
    let { sessions } = data
    Program.create(programNoSession)
        .then((programDoc) => addSessionsToDB(programDoc, sessions, res))
        .catch(next)
}

const editProgram = (req, res, next) => {
    const { body: data, params: { id } } = req
    let programNoSession = (({ name, desc, category }) => ({ name, desc, category }))(data)
    let { sessions } = data
    Program.findByIdAndUpdate(id, programNoSession) // first find if there is a program with the given ID
        .then((programDoc) => {
            if (!programDoc) return next(createError.NotFound('There is no program with the given ID'))
            const { _id: programID } = programDoc
            // Delete all current sessions associated with this program
            Session.deleteMany({ programID: programID })
                .then(() => addSessionsToDB(programDoc, sessions, res))
            // Add all the incoming sessions to the DB and establish the bidirectional link between sessions <--> program

        })
        .catch(next)
}

const deleteProgram = (req, res, next) => {
    let { params: { id } } = req
    Program.findByIdAndDelete(id)
        .then(({ _id: programID }) => {
            if (!programID) return next(createError.NotFound('There is no program with the given ID'))
            Session.deleteMany({ programID: programID }).then(() => res.status(200).json('Operation completed successfully'))
        })
        .catch(next)
}

function addSessionsToDB(programDoc, sessions, res) {
    const { _id: programID } = programDoc
    let sessionIDs = []
    sessions.forEach((session) => {
        session.programID = programID
        Session.create(session).then(({ _id: sessionID }) => sessionIDs.push(sessionID))
    })
    let timeout = setInterval(() => {
        if (sessionIDs.length === sessions.length) { // check if all the sessions has been added to the DB
            clearInterval(timeout)
            programDoc.sessions = sessionIDs
            programDoc.save()
            res.status(200).json({ _id: programID })
        }
    }, 100)
}

module.exports = { listPrograms, addProgram, editProgram, deleteProgram }
