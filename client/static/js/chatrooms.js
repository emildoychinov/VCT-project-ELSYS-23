var list = document.getElementById("room-list");
var socket = io();

var chatroom_form = document.querySelector('.chatroom_container');
var submit = document.querySelector('.chatroom_container > button');

async function load_user_rooms(user){
    socket.emit('get_user_rooms', user)
    socket.on('post_user_rooms', async (rooms) => {
        for(room of rooms){
            var li = document.createElement("li");
            li.setAttribute("id", (room.id).toString());
            li.addEventListener("click", (element) => {
                window.localStorage.setItem("ROOM_ID", element.target.id);
                window.location.href = '/';
            })
            li.innerHTML = room.name;
            list.appendChild(li);
        }
    })
}

window.onload = async function (){
    var user = window.localStorage.getItem("USER");
    load_user_rooms(user);
}

submit.addEventListener('click', () => {
	const data = Object.fromEntries(new FormData(chatroom_form));
	var name = document.querySelector('.chatroom_container > #name').value;
	var members = document.querySelector('.chatroom_container > #members').value;
	var user = localStorage.getItem('USER');

	members = members.split(',');	
	members.push(user);

	socket.emit('createChatroom', user, name, members);
	socket.on('createChatroomResponse', (res) => {
		if (res.code == 200) {
			window.location.reload();	

		} else if (res.code == 404) {
			alert(res.message);
		}
	});
});

