const mongoose = require('mongoose')

const TraineeSchema = new mongoose.Schema({
    basic_info: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    education: {
        type: String,
        required: true,
        enum: [
            'Less Than High School',
            'High School Diploma or Equivalent',
            'Some College, No Degree',
            'Associate’s Degree',
            'Bachelor’s Degree',
            'Postsecondary Non-Degree Award',
            'Master’s Degree',
            'Doctoral or Professional Degree'
        ]
    },
    department: {
        type: String,
        required: true,
        enum: ['IT', 'Marketing', 'Finance', 'Operations management', 'Human Resource']
    },
    assigned_programs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Program'}]
})

module.exports = mongoose.model('Trainee', TraineeSchema)
