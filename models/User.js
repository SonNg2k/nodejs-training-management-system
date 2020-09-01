const mongoose = require('mongoose'),
    bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
        maxlength: 254,
        dropDups: true // Drop duplicate records in schema
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'assistant', 'trainer', 'trainee']
    },
    name: {
        type: String,
        maxlength: 70,
        required: true
    },
    phone: {
        type: String,
        required: true,
        maxlength: 15
    },
    dob: {
        type: Date,
        required: true,
        min: '1950-01-01',
        max: '2015-12-31'
    },
    person_id: {
        type: mongoose.Schema.Types.ObjectId
    }
})

const saltRounds = 10;
UserSchema.pre('save', function (next) { // executed before the document is saved
    const document = this;
    if (document.isNew || document.isModified('password')) { // Check if document is new or a new password has been set
        bcrypt.hash(document.password, saltRounds)
            .then((hashedPassword) => {
                document.password = hashedPassword;
                next();
            })
            .catch(next)
    } else next()
})

UserSchema.methods.isCorrectPassword = (plainPassword) => bcrypt.compare(plainPassword, this.password)
// Either return a resolved promise with the boolean value (true if the pass does match and vice versa)
// or a rejected promise with an Error

module.exports = mongoose.model('User', UserSchema)
