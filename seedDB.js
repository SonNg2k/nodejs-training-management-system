const Category = require('./models/Category'),
    Program = require('./models/Program'),
    Session = require('./models/Session'),
    User = require('./models/User'),
    Trainer = require('./models/Trainer'),
    Trainee = require('./models/Trainee')


const categories = [
    { name: 'Web UI frameworks', desc: 'none' },
    { name: 'Web server-side frameworks', desc: 'none' },
    { name: 'Web security', desc: 'none' }
]

const programs = [
    {
        name: "React + Redux", desc: 'Power UI frameworks to build SPA data-driven web apps',
        sessions: [
            { name: "State in React Components", desc: 'Manage and distribute state of components' },
            { name: 'React Hooks', desc: 'new changes to the react functional components' }
        ]
    },
    {
        name: "Nodejs web dev", desc: 'server-side JS developers',
        sessions: [
            { name: "Lifecycle methods in React", desc: 'Amazing fundamentals in React' },
            { name: 'Redux', desc: 'Manage global state in React' }
        ]
    }
]

const assistants = [
    { name: "Bill Gates", email: 'assistant1@gmail.com', password: 'assistant1', phone: "0231 7021 1674", dob: new Date("1972-12-15") },
    { name: "Steve Jobs", email: "assistant2@gmail.com", password: 'assistant2', phone: "0224 0469 3114", dob: new Date("1981-09-10") }
]

const trainers = [
    {
        name: "Larry Page", email: "trainer1@gmail.com", password: 'trainer1', phone: "0299 0524 9862", dob: new Date("2001-01-01"),
        type: "internal", working_place: "FPT Ninh Kieu Dist"
    },
    {
        name: "Steve Balmer", email: "trainer2@gmail.com", password: 'trainer2', phone: "023 2818 3160", dob: new Date('2000-01-01'),
        type: "external", working_place: "FPT Dist 7"
    }
]

const trainees = [
    {
        name: "Steve Jobs", email: "trainee1@gmail.com", password: 'trainee1', phone: "021 9882 8745", dob: new Date("1960-01-01"),
        education: "Master’s Degree", department: "Operations management"
    },
    {
        name: "Steve Balmer", email: "trainee2@gmail.com", password: 'trainee2', phone: "0254 4522 8107", dob: new Date("1970-01-01"),
        education: "Doctoral or Professional Degree", department: "IT"
    }
]

module.exports = function seedDB() {
    // Empty DB. deleteMany must have a callback or it won't be executed
    Category.deleteMany({}, () => { })
    Program.deleteMany({}, () => { })
    Session.deleteMany({}, () => { })
    User.deleteMany({}, () => { })
    Trainer.deleteMany({}, () => { })
    Trainee.deleteMany({}, () => { })

    // Seed data
    categories.forEach((category) => Category.create(category))

    programs.forEach((program) => {
        let { sessions } = program
        let sessionIDs = [] // wait until sessionIDs.length === sessions.length?
        sessions.forEach((session) => Session.create(session).then(({ _id: sessionID }) => sessionIDs.push(sessionID)))

        let timeout = setInterval(() => {
            if (sessionIDs.length === sessions.length) { // check if all the sessions has been added to the DB
                clearInterval(timeout)
                program.sessions = sessionIDs
                Program.create(program)
            }
        }, 100)
    })

    assistants.forEach((assistant) => {
        assistant = { role: 'assistant', ...assistant }
        User.create(assistant)
    })

    trainers.forEach((trainer) => {
        // Extract user's most basic data
        let user = (({ name, email, password, phone, dob }) => ({ name, email, password, phone, dob }))(trainer)
        user = { role: 'trainer', ...user } // add the role

        // Extract the trainer info
        let trainerInfo = (({ type, working_place, assigned_sessions }) => ({ type, working_place, assigned_sessions }))(trainer)

        User.create(user) // add user to DB
            .then((newUser) => {
                let { _id: userID } = newUser // take the _id of the user just added to the DB
                trainerInfo = { basic_info: userID, ...trainerInfo } // link the trainer to the user
                Trainer.create(trainerInfo)
                    .then(({ _id: newTrainerID }) => {
                        newUser.person_id = newTrainerID
                        newUser.save()
                    })
            })
    })

    trainees.forEach((trainee) => {
        // Extract user's most basic data
        let user = (({ name, email, password, phone, dob }) => ({ name, email, password, phone, dob }))(trainee)
        user = { role: 'trainee', ...user } // add the role

        // Extract the trainee info
        traineeInfo = (({ education, department, assigned_programs }) => ({ education, department, assigned_programs }))(trainee)

        User.create(user) // add user to DB
            .then((newUser) => {
                let { _id: userID } = newUser // take the _id of the user just added to the DB
                traineeInfo = { basic_info: userID, ...traineeInfo } // link the trainer to the user
                Trainee.create(traineeInfo)
                    .then(({ _id: newTraineeID }) => {
                        newUser.person_id = newTraineeID
                        newUser.save()
                    })
            })
    })
}
