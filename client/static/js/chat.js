var socket = io();
var chatbox = document.getElementById("chatbox");
var current_user = window.localStorage.getItem("USER");
var chat_session = window.localStorage.getItem("ROOM_ID");
var lower_limit = 0;
var upper_limit = 30;

var change_room = document.querySelector(".change_room");

async function load_messages(){
    socket.emit('load_messages', 0, 30);
    socket.on('post_messages', async (messages) => {
        for(message of messages){
            chatbox.innerHTML += 
                "<p class='member_message'> <strong>" + ((message.author == current_user) ? "You" : message.author)  + ":</strong>" + message.content + "</p>";
                chatbox.scrollTop = chatbox.scrollHeight;
                lower_limit+=1;
        }
        upper_limit+=30;
    })
}

change_room.addEventListener('click', () => {
	localStorage.removeItem('ROOM_ID');
	window.location.href = "/chatrooms";
});

window.onload = async function(){
    socket.emit('changeRoom', chat_session);
    chatbox.innerHTML = "";

    if(chatbox.scrollTop == 0){
        load_messages();
        console.log("loading....");
    }

    var send_message = document.getElementById("send_message");
   
    send_message.addEventListener("click", async function(){
        var messageInput = document.getElementById("message-input");
        var message = messageInput.value;

        chatbox.innerHTML += "<p class='user_message' ><strong>You:</strong> " + message + "</p>";

        socket.emit('sendMessage', message, current_user);
        

        chatbox.scrollTop = chatbox.scrollHeight;
        messageInput.value = "";
    })

    socket.on('receiveMessage', async (message, author) => {
        chatbox.scrollTop = chatbox.scrollHeight;
        console.log('Received: ' + message);
        chatbox.innerHTML += "<p class='user_message' ><strong>" + author + ":</strong> " + message + "</p>";
    })
}
