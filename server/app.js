/**
 * Web-Chat server
 */
var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
var fs = require('fs');

var port = '3000';


httpd.listen(port, function () {
	console.log("Web Chat Server listening on port: %s", port);
});

function handler(req, res) {
	fs.readFile(__dirname + '/index.html', function (err, data) {
		if (err) {
			res.writeHead(500);
			res.end('Error loading index.html');
		} else {
			res.writeHead(200);
			res.end(data);
		}
	});
}

io.sockets.on('connection', function (socket) {
	socket.on('clientMessage', function (content) {
		socket.emit('serverMessage', 'You said: ' + content);
		socket.broadcast.emit('serverMessage', socket.id + ' said: ' + content);
	});
});