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
		
		socket.get('username', function (err, username) {
			if (!username) {
				username = socket.id;
			}
			socket.broadcast.emit('serverMessage', username + ' said: ' + content);
		});
	});
	
	
	socket.on('login', function (username) {
		socket.set('username', username, function (err) {
			if (err) {
				throw err;
			}
			socket.emit('serverMessage', 'Currently logged in as ' + username);
			socket.broadcast.emit('serverMessage', 'User ' + username + ' logged in');
		});
	});
	
	socket.on('disconnect', function () {
		socket.get('username', function (err, username) {
			if (!username) {
				username = socket.id;
			}
			socket.broadcast.emit('serverMessage', "User " + username + " disconnected");
		});
		
	});
	
	socket.emit('login');
	
});

