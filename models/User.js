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
// Use pre('validate') instead of pre('save') to set the value for the required field
// https://stackoverflow.com/questions/30141492/mongoose-presave-does-not-trigger

// function below is executed before the document is validated and saved
UserSchema.pre('validate', function (next) {
    const document = this
    // Check if document is new or a new password has been set
    if (document.isNew || document.isModified('password')) secureUserPass(document, next)
    else next()
})
// The hook above is only triggered when new document is added, NOT when it is updated via findOneAndUpdate

UserSchema.pre('findOneAndUpdate', function (next) {
    const document = this._update
    if (document.password) secureUserPass(document, next)
    else next()
})

UserSchema.methods.isCorrectPassword = (plainPassword) => bcrypt.compare(plainPassword, this.password)
// Either return a resolved promise with the boolean value (true if the pass does match and vice versa)
// or a rejected promise with an Error

function secureUserPass(document, next) {
    bcrypt.hash(document.password, saltRounds)
        .then((hashedPassword) => {
            document.password = hashedPassword;
            next();
        })
        .catch(next)
}

module.exports = mongoose.model('User', UserSchema)
