var config = {
  port: process.env['PORT'] || 3000,
  s3Bucket: 'fieldwire-onsite',
  thumbPxSize: 100,
  largePxSize: 2000
};

config.mongoURI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/test';

module.exports = config;