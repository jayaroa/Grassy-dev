const http = require('http');
const app = require('./app');
const env = require('./env');

const port = process.env.PORT || env.PORT;
const server = http.createServer(app);

server.listen(port, () => {
    console.log('The application is running on port ' + port);
});