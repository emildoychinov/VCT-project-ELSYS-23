var socket = io();
var chatbox = document.getElementById("chatbox");
var current_user = window.localStorage.getItem("USER");
var chat_session = window.localStorage.getItem("ROOM_ID");
var lower_limit = 0;
var upper_limit = 30;

var change_room = document.querySelector(".change_room");

async function load_messages(){
    socket.emit('load_messages', lower_limit, upper_limit);
    socket.on('post_messages', async (messages) => {
        for(message of messages){
            var msg = document.createElement("p");
            msg.className = "user_message";
            msg.innerHTML = "<strong>" + ((message.author == current_user) ? "You" : message.author)  + ":</strong>" + message.content;
            chatbox.insertBefore(msg, chatbox.firstChild);
            ("<p class='user_message'> <strong>" + ((message.author == current_user) ? "You" : message.author)  + ":</strong>" + message.content + "</p>");
            lower_limit+=1;
        }
        upper_limit+=30;
    })
}

change_room.addEventListener('click', () => {
	localStorage.removeItem('ROOM_ID');
    socket.emit('changeRoom', '');
	window.location.href = "/chatrooms";
});

window.onload = async function(){
    socket.emit('changeRoom', chat_session);
    if(chatbox.scrollTop == 0){
        await load_messages();
    }
    chatbox.scrollTop = chatbox.scrollHeight;

    chatbox.addEventListener("scroll", async function () {
        if(chatbox.scrollTop == 0){
            await load_messages();
        }
    })

    var send_message = document.getElementById("send_message");
    send_message.addEventListener("click", async function(){
        var messageInput = document.getElementById("message-input");
        var message = messageInput.value;
        if(!message.replace(/\s/g, '').length){
            return;
        }
        var msg = document.createElement("p");
        msg.className = "user_message";
        msg.innerHTML = "<b>You:</b>" + message;
        chatbox.appendChild(msg);
        socket.emit('sendMessage', message, current_user);
        chatbox.scrollTop = chatbox.scrollHeight;
        messageInput.value = "";
    })

    socket.on('receiveMessage', async (message, author) => {
        chatbox.scrollTop = chatbox.scrollHeight;
        console.log('Received: ' + message);
        var msg = document.createElement("p");
        msg.className = "user_message";
        msg.innerHTML = "<b>"+author+":</b>" + message;
        chatbox.appendChild(msg);
    })
}
