async function clear_form(){
    document.getElementById("login-form").reset();
}

async function validate(page, usernameValue, passwordValue, confirmedPasswordValue = "") {
    if (usernameValue.length < 4) {
        alert("Username needs to be at least 4 characters");
        return false;
    }

    if (passwordValue.length < 4) {
        alert("Password needs to be at least 4 characters");
        return false;
    }

    if (page == "register") {
        if (passwordValue != confirmedPasswordValue) {
            alert("Passwords don't match");
            return false;
        }
    }

    return true;
}

async function authenticate(socket, page, usernameValue, passwordValue){
	socket.emit(page, usernameValue, passwordValue);
	socket.on(page+'_resp', async (res)=>{
		console.log(res);

		if(res.code == 200){
			window.localStorage.setItem("USER", usernameValue);
			window.location.href = "/chatrooms";
			return true;
		}

		else if(res.code == 404){
			alert(res.message);
			return false;
		}
	});
}
