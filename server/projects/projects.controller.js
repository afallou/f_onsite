'use strict';

var ProjectsModel = require('./projects.model.js');

module.exports = class ProjectsController{

  constructor(){
    this.model = new ProjectsModel();
  }

  show(req, res){
    this.model.getProjects()
      .then(projects => {
        res.send(projects);
      })
  }

  showOne(req, res){
    this.model.getProject(req.params.projectId)
      .then(project => {
        res.send(project);
      });
  }

  /**
   * Create project, including the correct files and title
   * @param req
   * @param res
   */
  kreate(req, res){
    var fstream;
    var that = this;

    var imagesPromise;
    var projectProperties = {
      files: []
    };

    // Upload file to file system before doing more
    req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      // TODO: remove extension from filename
      imagesPromise = that.model.uploadFile(file, filename)
        .then(filepath => {
          return that.model.processUploadFile(filepath, filename);
        })
        .then(fileLocations => {
          projectProperties.files.push({
            filename: filename,
            original: fileLocations[0],
            thumb: fileLocations[1],
            large: fileLocations[2]
          });
        });
    });

    req.busboy.on('field', (key, value, keyTruncated, valueTruncated) => {
      projectProperties[key] = value;
    });

    req.busboy.on('finish', () => {
      imagesPromise.then(() => {
        this.model.createProject(projectProperties);
      });

    });

    req.pipe(req.busboy);
    res.send('Got request');
  }


  create(req, res){
    this.model.createProject({title: req.body.title})
      .then(id => {
        res.send({id});
      })
      .catch(err => {
        console.error(`Error creating project: ${err}`);
      })
  }
};