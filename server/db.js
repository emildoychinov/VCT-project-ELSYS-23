export const cassandra = require('cassandra-driver');

export const client = new cassandra.Client({

  contactPoints: ['localhost'],
  keyspace : 'app_data',
  localDataCenter: 'datacenter1'

});

export async function connect() {

  await client.connect();
  console.log('Connected to Cassandra');

}

export async function register_user(username, password){

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

export async function login_user(username, password){

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

export async function create_room(name, owner, users, isPrivate){
    
    const params = [name, owner, users, isPrivate];
    const query = "INSERT INTO message_rooms (room_id, name, creator, users, private) VALUES (uuid(), ?, ?, ?, ?)";
    await client.execute(query, params);

    return {
        "code" : 200,
        "message" : "message room created successfully"
    }
}

export async function get_user_rooms(user){

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

export async function post_message(room_id, author, content){

    const params = [room_id, author, content];
    const query = "INSERT INTO messages (room_id, message_id, author, content, sent_at) VALUES (?, uuid(), ?, ?, toUnixTimestamp(now()))";

    await client.execute(query, params);

    return {
        "code" : 200,
        "message" : "message received sucessfully"
    }

}

export async function load_messages(room_id, lower_limit, upper_limit){
    const params = [room_id];
    const query = "SELECT * FROM messages WHERE room_id = ? ORDER BY sent_at DESC LIMIT " + upper_limit;
    
    var res = (await client.execute(query, params)).rows.map((row) => {
        return { 
            content: row.content,
            author: row.author,
            sent_at: row.sent_at
        };
    });
    
    return res.slice(lower_limit, upper_limit+1);
}








