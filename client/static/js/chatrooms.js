var list = document.getElementById("room-list");
var socket = io();
async function load_user_rooms(user){
    
    socket.emit('get_user_rooms', user)
    socket.on('post_user_rooms', async (rooms) => {
        for(room of rooms){
            var li = document.createElement("li");
            li.setAttribute("id", (room.id).toString());
            li.addEventListener("click", (element) => {
                window.localStorage.setItem("ROOM_ID", element.target.id);
                window.location.href = '/chat';
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