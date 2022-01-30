const http = require('http');
const url = require('url');
const service = require('./service.js');

module.exports = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, UPDATE, DELETE');

  const reqUrl = url.parse(req.url, true);

  // GET Endpoint
  if (reqUrl.pathname == '/api' && req.method === 'GET') {
    consoleLogReqMethodPath(req);
    service.getAPI(req, res);

  } else if (reqUrl.pathname == '/list' && req.method === 'GET') {
    consoleLogReqMethodPath(req);
    service.getGroupedList(req, res);

  } else if (reqUrl.pathname == '/groups' && req.method === 'GET') {
    consoleLogReqMethodPath(req);
    service.getGroups(req, res);

  } else if (reqUrl.pathname == '/item' && req.method === 'GET') {
    consoleLogReqMethodPath(req);
    service.getItem(req, res);



    // POST Endpoint
  } else if (reqUrl.pathname == '/group' && req.method === 'POST') {
    consoleLogReqMethodPath(req);
    service.createGroup(req, res);

  } else if (reqUrl.pathname == '/item' && req.method === 'POST') {
    consoleLogReqMethodPath(req);
    service.createItem(req, res);



    // PATCH Endpoint
  } else if (reqUrl.pathname == '/item' && req.method === 'PATCH') {
    consoleLogReqMethodPath(req);
    service.updateItem(req, res);



    // DELETE Endpoint
  } else if (reqUrl.pathname == '/item' && req.method === 'DELETE') {
    consoleLogReqMethodPath(req);
    service.deleteItem(req, res);




  } else {
    console.log(`Request Type: ${req.method}    Invalid Endpoint: ${reqUrl.pathname}`);
    service.invalidRequest(req, res);
  }

});


function consoleLogReqMethodPath(req) {
  const reqUrlParsed = url.parse(req.url, true);
  console.log(`Request Type: ${req.method}    Endpoint: ${reqUrlParsed.pathname}`);
}
