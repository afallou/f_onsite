'use strict';
var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
var zlib = require('zlib');

var config = require('../config');

module.exports = class ProjectsModel{

  constructor(){
  }

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

  processUploadFile(filepath, filename){
    this.uploadToS3(filepath, filename);
  }

  uploadToS3(filepath, filename){
    var outStream = fs.createReadStream(filepath);
    var s3Obj = new AWS.S3({params: {Bucket: config.s3Bucket, Key: filename}});
    s3Obj.upload({Body: outStream})
      .send((err, data) => { console.log(err, data)});
  }
};