const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require('body-parser')
const configureRoutes = require("../routers/index");


const app = express();
// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

configureRoutes(app);

module.exports = app;