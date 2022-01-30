fs = require('fs');


const filename = `${process.cwd()}/server/data.json`;


exports.readData = cb => {
  checkFile(() => {
    fs.readFile(filename, function(err, data) {
      cb && cb(err, data?.toString());
    });
  });
};


exports.writeData = (content, cb) => {
  checkFile(() => {
    fs.writeFile(filename, content, err => {
      if (err) {
        console.error('writeFile error: ', err)
        cb && cb(err);
      }
      cb && cb();
    })
  });
};



function checkFile(cb) {
  fs.access(filename, (err) => {
    if (err) {
      console.log("The file does not exist.");
      fs.writeFile(filename, '', function (err) {
        if (err) throw err;
        cb && cb()
      })
    } else {
      // console.log("The file exists.");
      cb && cb()
    }
  });
}


