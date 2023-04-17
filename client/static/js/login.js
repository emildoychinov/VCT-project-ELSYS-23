var socket = io();
var username = document.getElementById("username");
var password = document.getElementById("password");
var login = document.getElementsByClassName("button")[0];
const redirect = document.querySelector('.redirect');

window.onload = () => {
	if (localStorage.hasOwnProperty('USER')) window.href = '/';	
};

login.addEventListener('click', async function(){
	var username_value = username.value;
	var password_value = password.value;

	let res = await validate('login', username_value, password_value);

	if(!res){
		clear_form();
		return;
	}

	res = await authenticate(socket, 'login', username_value, password_value);

	if(!res){
		clear_form();
		return;
	}
});

redirect.addEventListener('click', () => {
	window.location.href = "/sign_up";
});
