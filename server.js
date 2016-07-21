var express = require('express');
var config = require('./config');

var app = express();

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});