'use strict';

var ProjectsModel = require('./projects.model.js');

module.exports = class ProjectsController{

  constructor(){
    this.model = new ProjectsModel();
  }

  /**
   * Create project, including the correct files and title
   * @param req
   * @param res
   */
  create(req, res){
    var fstream;
    var that = this;

    var projectProperties = {
      fileLocations: {}
    };

    // Upload file to file system before doing more
    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      that.model.uploadFile(file, filename)
        .then(filepath => {
          that.model.processUploadFile(filepath, filename)
        })
        .then(fileLocations => {
          projectProperties.fileLocations = {
            original: fileLocations[0],
            thumb: fileLocations[1],
            large: fileLocations[2]
          }
        });
    });

    req.busboy.on('field', (key, value, keyTruncated, valueTruncated) => {
      projectProperties[key] = value;
    });

    req.pipe(req.busboy);

    this.model.createProject(projectProperties);
    res.send('Got request');
  }
};