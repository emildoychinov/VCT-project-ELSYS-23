const database = require('./db.js');

const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

const port = 5000;

app.use(express.static('./client/static'));

app.get('/', (req, res) => {
	res.sendFile('/client/html/chat.html', { root: './' });
});

app.get('/sign_in', (req, res) => {
	res.sendFile('/client/html/login.html', { root: './' });
});

app.get('/sign_up', (req, res) => {
	res.sendFile('/client/html/register.html', { root: './' });
});

app.get('/chatrooms', (req, res) => {
	res.sendFile('/client/html/chatrooms.html', { root: './' });
});

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.room = '';

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('sendMessage', async (msg, author) => {
		await database.post_message(socket.room, author, msg)
		socket.to(socket.room).emit('receiveMessage', msg, author);
	});

	socket.on('changeRoom', (newRoom) => {
		if (socket.room != '') socket.leave(socket.room);
		console.log('left ' + socket.room + ' and joined ' + newRoom);
		socket.join(newRoom);
		socket.room = newRoom;
	});

	socket.on('login', async (username, password) => {
		var res = await database.login_user(username, password);
		socket.emit('login_resp', res);
	});

	socket.on('register', async (username, password) => {
		var res = await database.register_user(username, password);
		socket.emit('register_resp', res);
	})

	socket.on('get_user_rooms', async(user) => {
		var res = await database.get_user_rooms(user);
		socket.emit('post_user_rooms', res);
	});

	socket.on('createChatroom', async (user, name, members) => {
		var res = await database.create_room(name, user, members, false);		
		socket.emit('createChatroomResponse', res);
	});

	socket.on('load_messages', async(lower_limit, upper_limit) => {
		if(socket.room != ''){
			var res = await database.load_messages(socket.room, lower_limit, upper_limit);
			socket.emit('post_messages', res);
		}
	});
});

httpServer.listen(port, () => {
	console.log(`Server running on ${port}`)
});
