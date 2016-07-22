var express = require('express');
var busboy = require('connect-busboy');

var config = require('./config');
var ProjectsController = require('./projects/projects.controller');

var projects = new ProjectsController();

var app = express();
app.use(busboy());
app.use('/', express.static('./client'));

app.post('/projects', (req, res) => projects.create(req, res));

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});