const cassandra = require('cassandra-driver');

const client = new cassandra.Client({

  contactPoints: ['localhost'],
  keyspace : 'app_data',
  localDataCenter: 'datacenter1'

});

async function connect() {

  await client.connect();
  console.log('Connected to Cassandra');

}

async function register_user(username, password){

    var params = [username];

    var isExisting =  !( (await client.execute("SELECT * FROM users WHERE username = ?", params)).rows.length == 0 )

    if(isExisting){
        return {
            "code" : 404,
            "message" : "user already exists"
        }
    }

    params[1] = password;
    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    await client.execute(query, params);

    return {
        "code" : 200,
        "message" : "registered successfully"
    }

}

async function login_user(username, password){

    const params = [username];
    var res = (await client.execute("SELECT * FROM users WHERE username = ?", params)).rows;

    console.log(res)
    
    if(res.length == 0){
        return {
            "code" : 404,
            "message" : "wrong username/password"
        }
    }
    else if(res[0].password == password){
        return {
            "code" : 200,
            "message" : "logged in successfully"
        }
    }
    else{
        return {
            "code" : 404,
            "message" : "wrong username/password"
        }
    }
}

async function create_room(name, owner, users, isPrivate){
    
    const params = [name, owner, users, isPrivate];
    const query = "INSERT INTO message_rooms (room_id, name, creator, users, private) VALUES (uuid(), ?, ?, ?, ?)";
    await client.execute(query, params);

    return {
        "code" : 200,
        "message" : "message room created successfully"
    }
}

async function get_user_rooms(user){

    const params = [user];
    const query = "SELECT * FROM message_rooms WHERE users CONTAINS ?";
    var res = (await client.execute(query, params)).rows.map((row) => {
        return { 
            id: row.room_id.buffer,
            name: row.name
        };
    });

    return res;
}

async function post_message(room_id, author, content){

    const params = [room_id, author, content];
    const query = "INSERT INTO messages (room_id, message_id, author, content, sent_at) VALUES (?, uuid(), ?, ?, toUnixTimestamp(now()))";

    await client.execute(query, params);

    return {
        "code" : 200,
        "message" : "message received sucessfully"
    }

}



connect();

create_room("goshan", "petak", ["misho", "tisho", "gencho", "encho"], false);
create_room("goshan", "petak", ["grishisho", "tisho", "gencho", "tencho"], true);

var id = Promise.resolve(get_user_rooms("tisho"));

id.then((value)=>{

    const res = Promise.resolve(post_message(value[0].id, "tisho", "az sum tup pedal"));
    
    res.then((value) =>{
        console.log(value);
    })

})







