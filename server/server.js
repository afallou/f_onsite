var express = require('express');
var busboy = require('connect-busboy');

var config = require('./config');
var ProjectsController = require('./projects/projects.controller');

var projects = new ProjectsController();

// Connect to DB
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(config.mongoURI, (err, dbConn) => {
  if (err){
    console.error(`Error connecting to the database: ${err}`);
  } else {
    global.db = dbConn;
    console.log('Database connected');
  }
});

var app = express();
app.use(busboy());
app.use('/', express.static('./client'));

app.post('/projects', (req, res) => projects.create(req, res));
app.get('/projects', (req, res) => projects.show(req, res));

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});