window.onload = function (){
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var login = document.getElementsByClassName("button")[0];

    login.addEventListener('click', async function(){
        var username_value = username.value;
        var password_value = password.value;

        socket.emit('login', username_value, password_value);
        
        socket.on('login_resp', async (res)=>{
            
            if(res.code == 200){
                alert("pishka v guza");
                return;
            }
    
            else if(res.code == 404){
                alert("nqma pishka v guza");
                return;
           }

        });

    });
}