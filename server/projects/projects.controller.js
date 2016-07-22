'use strict';

var ProjectsModel = require('./projects.model.js');

module.exports = class ProjectsController{

  constructor(){
    this.model = new ProjectsModel();
  }

  create(req, res){
    var fstream;
    var that = this;
    // Upload file to file system before doing more
    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      that.model.uploadFile(file, filename)
        .then(filepath => that.model.processUploadFile(filepath, filename));
    });
    req.pipe(req.busboy);

    res.send('Got request');
  }
};