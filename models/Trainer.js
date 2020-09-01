const mongoose = require('mongoose')

const TrainerSchema = new mongoose.Schema({
    basic_info: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['internal', 'external']
    },
    working_place: {
        type: String,
        required: true,
        enum: ['FPT Dist 1', 'FPT Dist 2', 'FPT Dist 7', 'FPT Ninh Kieu Dist']
    },
    assigned_sessions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Session'}]
})

module.exports = mongoose.model('Trainer', TrainerSchema)
