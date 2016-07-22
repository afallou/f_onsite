var express = require('express');

var config = require('./config');

var app = express();
app.use('/', express.static('./client'));

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});