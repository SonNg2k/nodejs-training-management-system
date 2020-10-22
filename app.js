const express = require('express');
const { dbConnect, setup, initRoutes, handleErr, start } = require('./app')

const seedDB = require('./seedDB')

require('dotenv').config();

const app = express();

// seedDB()

dbConnect()
setup(app)
initRoutes(app)
handleErr(app)
start(app)
