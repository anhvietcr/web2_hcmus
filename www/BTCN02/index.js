const express = require('express');
const app = new express();
const port = process.env.PORT || 3002;

app.use(express.static(__dirname + '/asset'));
app.get('/', (request, response) => {

	response.sendFile(__dirname + '/index.html');

}).listen(port);
