const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const route = require('./controllers');

app.use(bodyParser.json());

app.use(route);

module.exports = app;