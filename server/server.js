const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

const port = 1234;

app.use(express.static('./client/static'));

app.get('/', (req, res) => {
	res.sendFile('/client/html/home.html', { root: './' });
});

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.room = '';

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('sendMessage', (msg) => {
		socket.to(socket.room).emit('receiveMessage', msg);
	});

	socket.on('changeRoom', (newRoom) => {
		if (socket.room != '') socket.leave(socket.room);
		console.log('left ' + socket.room + ' and joined ' + newRoom);
		socket.join(newRoom);
		socket.room = newRoom;
	});
});

httpServer.listen(port, () => {
	console.log(`Server running on ${port}`)
});
