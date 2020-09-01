const mongoose = require('mongoose')

const ProgramSchema = new mongoose.Schema({
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
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    sessions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Session'}]
})

module.exports = mongoose.model('Program', ProgramSchema)
