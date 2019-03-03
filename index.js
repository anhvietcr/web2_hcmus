const http = require('http')

// listen any port
const port = process.env.PORT || 3000;

http.createServer((request, response) => {

	response.write("Hello world");
	response.end();

}).listen(port);