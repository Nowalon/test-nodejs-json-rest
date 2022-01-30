const url = require('url');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');
const dataService = require('./dataService');


exports.getAPI = (req, res) => {
  fs.readFile(path.resolve(__dirname, 'api.txt'), 'utf8', (err, data) => {
    if (err) throw err;
    const result = data.replace(/\/\/127\.0\.0\.1:8888/gi, `http://${config.API_URL.replace(/\/\//gi, '')}:${config.PORT}`);
    res.statusCode = 200;
    res.end(result);
  });
};


exports.getGroupedList = (req, res) => {
  const reqUrl = url.parse(req.url, true);

  const response = {
    status: 'ok',
    error: null,
    data: null
  };

  dataService.handleGetGroupedList(reqUrl.query, ({error, data}) => {
    if (error) {
      console.error(`Error getting list: ${error}`);
      response.status = 'error';
      response.error = error;
    } else {
      response.data = data;
    }

    res.statusCode = error ? 400 : 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
  });
};


exports.getGroups = (req, res) => {
  const reqUrl = url.parse(req.url, true);

  const response = {
    status: 'ok',
    error: null,
    data: null
  };

  dataService.handleGetGroups(reqUrl.query, ({error, data}) => {
    if (error) {
      console.error(`Error getting groups: ${error}`);
      response.status = 'error';
      response.error = error;
    } else {
      response.data = data;
    }

    res.statusCode = error ? 400 : 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
  });
};


exports.getItem = (req, res) => {
  const reqUrl = url.parse(req.url, true);

  const response = {
    status: 'ok',
    error: null,
    data: null
  };

  dataService.handleGetItem(reqUrl.query, ({error, data, code}) => {
    if (error) {
      console.error(`Error getting item: ${error}`);
      response.status = 'error';
      response.error = error;
    } else {
      response.data = data;
    }

    res.statusCode = error ? code || 400 : 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
  });
};


exports.createGroup = (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  let response = {
    status: 'ok',
    error: null,
    data: null
  };

  req.on('end', () => {
    let postBody = ''
    try {
      postBody = JSON.parse(body);
    } catch(e) {
      console.log(`JSON.parse error: ${e}`);
      response.status = 'error';
      response.error = `Error: wrong JSON passed: ${e}`;
    }

    if (postBody && !response.error) {
      dataService.handleCreateGroup(postBody, ({error, data}) => {
        if (error) {
          console.error(`Error creating group: ${error}`);
          response.status = 'error';
          response.error = error;
        } else {
          response.data = data;
        }

        res.statusCode = error ? 400 : 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
      });

    } else {
      res.statusCode = response.error ? 400 : 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
    }
  });
};


exports.createItem = (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  let response = {
    status: 'ok',
    error: null,
    data: null
  };

  req.on('end', () => {
    let postBody = ''
    try {
      postBody = JSON.parse(body);
    } catch(e) {
      console.log(`JSON.parse error: ${e}`);
      response.status = 'error';
      response.error = `Error: wrong JSON passed: ${e}`;
    }

    if (postBody && !response.error) {
      dataService.handleCreateItem(postBody, ({error, data}) => {
        if (error) {
          console.error(`Error creating item: ${error}`);
          response.status = 'error';
          response.error = error;
        } else {
          response.data = data;
        }

        res.statusCode = error ? 400 : 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
      });

    } else {
      res.statusCode = response.error ? 400 : 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
    }
  });
};



exports.updateItem = (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  let response = {
    status: 'ok',
    error: null,
    data: null
  };

  req.on('end', () => {
    let postBody = ''
    try {
      postBody = JSON.parse(body);
    } catch(e) {
      console.log(`JSON.parse error: ${e}`);
      response.status = 'error';
      response.error = `Error: wrong JSON passed: ${e}`;
    }

    if (postBody && !response.error) {
      dataService.handleUpdateItem(postBody, ({error, data}) => {
        if (error) {
          console.error(`Error updating item: ${error}`);
          response.status = 'error';
          response.error = error;
        } else {
          response.data = data;
        }

        res.statusCode = error ? 400 : 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
      });

    } else {
      res.statusCode = response.error ? 400 : 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
    }
  });
};



exports.deleteItem = (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  let response = {
    status: 'ok',
    error: null,
    data: null
  };

  req.on('end', () => {
    let postBody = ''
    try {
      postBody = JSON.parse(body);
    } catch(e) {
      console.log(`JSON.parse error: ${e}`);
      response.status = 'error';
      response.error = `Error: wrong JSON passed: ${e}`;
    }

    if (postBody && !response.error) {
      dataService.handleDeleteItem(postBody, ({error, data}) => {
        if (error) {
          console.error(`Error deleting item: ${error}`);
          response.status = 'error';
          response.error = error;
        } else {
          response.data = data;
        }

        res.statusCode = error ? 400 : 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
      });

    } else {
      res.statusCode = response.error ? 400 : 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
    }
  });
};







exports.invalidRequest = (req, res) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Invalid Request');
};
