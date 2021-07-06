const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3003;
console.log('Port: ' + port);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Website is running at http://localhost:${port}`);
});