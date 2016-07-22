'use strict';
var fs = require('fs');
var path = require('path');

module.exports = class ProjectsModel{

  constructor(){}

  /**
   * Upload file to local filesystem
   * @param {FileStream} file
   * @param {String} filename
   */
  uploadFile(file, filename){
    return new Promise((resolve, reject) => {
      console.log(`Uploading file ${filename}`);
      // TODO: prefix name to avoid collisions
      var tempPath = path.join(__dirname, '..', `tmp/${filename}`);
      var fstream = fs.createWriteStream(tempPath);
      file.pipe(fstream);
      fstream.on('close', () => {
        console.log(`Finished uploading ${filename}`);
        resolve(tempPath);
      });
    });
  }

  processUploadFile(filepath){
  }
};