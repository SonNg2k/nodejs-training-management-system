const mongoose = require('mongoose'),
    handleErr = require('./errHandler')

/* Don't use exports.functionName because when you're at the end,
u have to scroll up again to see what are actually exported */
const dbConnect = () => {
    const uri = process.env.ATLAS_URI || 'mongodb://localhost/FPT-DB';
    mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });

    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log("MongoDB database connection established successfully");
    })
}

const setup = (app) => {
    app.use(express.static(__dirname + '/../client/build')) // path.resolve(__dirname, '/../client/build')
    app.use(express.json());
    app.use((req, res, next) => { // make "/path" and "/path/" to be the same
        const test = /\?[^]*\//.test(req.url);
        if (req.url.substr(-1) === "/" && req.url.length > 1 && !test)
            res.redirect(301, req.url.slice(0, -1));
        else next();
    });
    app.disable('x-powered-by'); // NOT reveal the technology of server (Express.js) to hackers
}


const initRoutes = (app) => {
    const routes = require('../routes')
    app.use("/", routes);
    app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, './client/build', 'index.html')));
    app.all("*", (req, _res, next) => {
        next(new createError.NotFound(`Page not found. ${req.ip} tried to reach ${req.originalUrl}`))
    })
}

const start = (app) => {
    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`API server is running on port: ${port}`));
}

module.exports = {dbConnect, setup, initRoutes, handleErr, start}
