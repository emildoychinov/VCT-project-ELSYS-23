const usr_form = document.querySelector(".username_init");
const usr_submit = document.querySelector(".username_init > .submit");

const room_form = document.querySelector(".room_init");
const room_submit = document.querySelector(".room_init > .submit");

const msg_form = document.querySelector(".msg_init");
const msg_submit = document.querySelector(".msg_init > .submit");

var socket = io();
var messages = document.querySelector("#messages");

usr_submit.addEventListener('click', () => {
	const data = Object.fromEntries(new FormData(usr_form));
	console.log(data.username);
});

room_submit.addEventListener('click', () => {
	const data = Object.fromEntries(new FormData(room_form));
	console.log(data.room);

	socket.emit('changeRoom', data.room);
});

msg_submit.addEventListener('click', () => {
	var msg = Object.fromEntries(new FormData(msg_form));
	console.log(msg.message);

	socket.emit('sendMessage', msg.message);
});

socket.on('receiveMessage', (msg) => {
	console.log('Received: ' + msg);
	var item = document.createElement('li');
	item.textContent = msg;
	messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
