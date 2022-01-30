const config = require('./config.js');

const hostname = config.HOSTNAME || '127.0.0.1';
const apiUrl = config.API_URL || '127.0.0.1';
const port = config.PORT || 3088;

const server = require('./controller.js');

server.listen(port, hostname, () => {
  console.log(`\x1b[34mServer running at http://${hostname}:${port}/ ( http://${apiUrl.replace(/\/\//gi, '')}:${port}/ , http://localhost:${port}/ ) \x1b[0m`);
  console.log(`\x1b[34mAPI description: http://${apiUrl.replace(/\/\//gi, '')}:${port}/api  ( or http://${hostname}:${port}/api or http://localhost:${port}/api ) \x1b[0m`);
});













