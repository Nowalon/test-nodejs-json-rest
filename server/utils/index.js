const path = require('path');
const fs = require('fs');
const loremIpsumString = require('./loremIpsumString');


exports.getRandomIntMinMax = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


exports.getRandomLoremIpsumWord = () => {
  const lrArr = loremIpsumString.lrStrClean.split(' ');
  return lrArr[exports.getRandomIntMinMax(0,lrArr.length-1)];
};


exports.readFilenamesInDirectory = (directory, cb) => {
  if (!directory) {
    cb && cb('no directory passed!', null);
    return [];
  }
  fs.readdir(path.resolve(__dirname, directory), function(error, filenames) {
    if (error) {
      cb && cb(error, null);
    } else {
      cb && cb(null, filenames);
    }
  });
};


