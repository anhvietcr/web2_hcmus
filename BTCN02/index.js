const express = require('express');
const app = new express();

const port = process.env.PORT || 3000;

app.use(express.static('asset'));
app.get('/', (request, response) => {

	response.sendFile(__dirname + '/index.html');

}).listen(port);
