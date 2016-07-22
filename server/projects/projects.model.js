'use strict';
var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
var zlib = require('zlib');
var gm = require('gm').subClass({imageMagick: true});

var config = require('../config');

module.exports = class ProjectsModel{

  constructor(){}

  getProjects(){
    return new Promise((resolve, reject) => {
      global.db.collection('projects').find({}, {title: 1})
        .toArray((err, result) => {
          if (err) {
            console.error(err);
            reject();
          } else {
            resolve(result);
          }
        });
    });
  }

  createProject(properties){
    return new Promise((resolve, reject) => {
      global.db.collection('projects').insertOne(properties,
        (err, result) => {
          if (err) {
            console.error(err);
            reject();
          } else {
            resolve(result);
          }
        });
    });
  }

  /**
   * Upload file to local filesystem
   * @param {FileStream} file
   * @param {String} filename
   */
  //TODO delete files in filesystem
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

      fstream.on('error', err => {
        console.error(`Error uploading file: ${err.stack}`);
      })
    });
  }

  /**
   * From the original file, build large version and thumbnails
   * @param {String} filepath - Path of original file on local filesystem
   * @param {String} filename - Name of file uploaded by user
   * @returns {Promise}
   */
  processUploadFile(filepath, filename){
    var promOrig = this.uploadToS3(filepath, filename);
    var size;

    var thumbPath = path.join(__dirname, '..', `tmp/${filename}_thumb.png`);
    var largePath = path.join(__dirname, '..', `tmp/${filename}_large.png`);
    // 'resize' will fit the image into the given dimensions

    // TODO: could we avoid writing the file and stream it directly to S3 instead?
    var promThumb = this.squareResizeAndWrite(filepath, thumbPath, config.thumbPxSize)
      .then(() => {
        return this.uploadToS3(thumbPath, `${filename}_thumb`);
      })
      .catch(err => {
        console.error(err.stack);
      });
    var promLarge = this.squareResizeAndWrite(filepath, largePath, config.largePxSize)
      .then(() => {
        return this.uploadToS3(largePath, `${filename}_large`);
    });

    return Promise.all([promOrig, promThumb, promLarge]);
  }

  /**
   * Take file at path, resize into correct dimensions and write back to local filesystem
   * @param {string} inPath
   * @param {string} outPath
   * @param {number} size
   */
  squareResizeAndWrite(inPath, outPath, size){
    // Resize fits the image into the given dimension, while keeping aspect ratio
    return new Promise((resolve, reject) => {
      gm(inPath)
        .resize(size, size)
        .write(outPath, err => {
          if (err){
            console.error(`Error resizing image to thumb size: ${err}`);
          } else {
            resolve();
          }
        });
    });
  }

  /**
   * Upload file to S3
   * @param {String} filepath - Path on local filesystem
   * @param {String} filename - Name of file, that will be used as key on S3
   * @returns {Promise}
   */
  uploadToS3(filepath, filename){
    var outStream = fs.createReadStream(filepath);
    var s3Obj = new AWS.S3({params: {Bucket: config.s3Bucket, Key: filename}});

    // TODO: create unique string for storage key on S3 to avoid collisions
    return new Promise((resolve, reject) => {
      s3Obj.upload({Body: outStream})
        .send((err, data) => {
          if(err){
            console.error(`Error uploading file ${filename} to S3: ${err}`);
            reject();
          } else {
            console.log(`Successfully upload file ${filename} to S3`);
            resolve(data.Location);
          }
        });
    });
  }
};