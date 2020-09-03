const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
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
