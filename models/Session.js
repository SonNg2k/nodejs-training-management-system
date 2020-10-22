const mongoose = require('mongoose')
const { schema } = require('./Program')

const SessionSchema = new mongoose.Schema({
    programID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },
    name: {
        type: String,
        required: true,
        maxlength: 70
    },
    desc: {
        type: String,
        required: true,
        maxlength: 100,
        default: 'none'
    }
})

module.exports = mongoose.model('Session', SessionSchema)
