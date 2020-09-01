const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
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

module.exports = mongoose.model('Category', CategorySchema)
