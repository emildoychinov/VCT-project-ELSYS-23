window.onload = async function (){
    var socket = io();
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var confirm_password = document.getElementById("confirm-password");
    var login = document.getElementsByClassName("button")[0];

    login.addEventListener('click', async function(){
        var username_value = username.value;
        var password_value = password.value;
        var confirm_password_value = confirm_password.value;
        
        var username_value = username.value;
        var password_value = password.value;

        console.log(username_value, password_value, confirm_password_value);

        let res = await validate('register', username_value, password_value, confirm_password_value);
        
        if(!res){
            clear_form();
            return;
        }

        res = await authenticate(socket, 'register', username_value, password_value);
        
        if(!res){
            clear_form();
            return;
        }

    });
}