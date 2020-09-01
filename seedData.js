let seedData = {}

seedData.categories = [
    { name: 'Web UI frameworks', desc: 'none' },
    { name: 'Web server-side frameworks', desc: 'none' },
    { name: 'Web security', desc: 'none' }
]

seedData.programs = [
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

seedData.assistants = [
    { name: "Bill Gates", email: 'assistant1@gmail.com', password: 'assistant1', phone: "0231 7021 1674", dob: new Date("1972-12-15") },
    { name: "Steve Jobs", email: "assistant2@gmail.com", password: 'assistant2', phone: "0224 0469 3114", dob: new Date("1981-09-10") }
]

seedData.trainers = [
    {
        name: "Larry Page", email: "trainer1@gmail.com", password: 'trainer1', phone: "0299 0524 9862", dob: new Date("2001-01-01"),
        type: "internal", working_place: "FPT Ninh Kieu Dist"
    },
    {
        name: "Steve Balmer", email: "trainer2@gmail.com", password: 'trainer2', phone: "023 2818 3160", dob: new Date('2000-01-01'),
        type: "external", working_place: "FPT Dist 7"
    }
]

seedData.trainees = [
    {
        name: "Steve Jobs", email: "trainee1@gmail.com", password: 'trainee1', phone: "021 9882 8745", dob: new Date("1960-01-01"),
        education: "Master’s Degree", department: "Operations management"
    },
    {
        name: "Steve Balmer", email: "trainee2@gmail.com", password: 'trainee2', phone: "0254 4522 8107", dob: new Date("1970-01-01"),
        education: "Doctoral or Professional Degree", department: "IT"
    }
]
