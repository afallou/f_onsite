'use strict';
var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
var zlib = require('zlib');
var gm = require('gm').subClass({imageMagick: true});

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

    var size;

    var thumbPath = path.join(__dirname, '..', `tmp/${filename}_thumb.png`);
    var largePath = path.join(__dirname, '..', `tmp/${filename}_large.png`)
    // 'resize' will fit the image into the given dimensions

    this.squareResizeAndWrite(filepath, thumbPath, config.thumbPxSize);
    this.squareResizeAndWrite(filepath, largePath, config.largePxSize);

    this.uploadToS3(thumbPath, `${filename}_thumb`);
    this.uploadToS3(largePath, `${filename}_large`);
  }

  squareResizeAndWrite(inPath, outPath, size){
    // Resize fits the image into the given dimension, while keeping aspect ratio
    gm(inPath)
      .resize(size, size)
      .write(outPath, err => {
        if (err){
          console.error(`Error resizing image to thumb size: ${err}`);
        }
      });
  }

  uploadToS3(filepath, filename){
    var outStream = fs.createReadStream(filepath);
    var s3Obj = new AWS.S3({params: {Bucket: config.s3Bucket, Key: filename}});
    s3Obj.upload({Body: outStream})
      .send((err, data) => {
        if(err){
          console.error(`Error uploading file ${filename} to S3: ${err}`);
        } else {
          console.log(`Successfully upload file ${filename} to S3`);
        }
      });
  }
};