CREATE KEYSPACE IF NOT EXISTS app_data WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'} AND durable_writes = true;
USE app_data;


CREATE TABLE IF NOT EXISTS users (
	
	username TEXT PRIMARY KEY,
	password TEXT
	
);

CREATE TABLE IF NOT EXISTS message_rooms (
	
	room_id UUID PRIMARY KEY,
	name TEXT,
	creator TEXT,
	users SET<TEXT>,
	private BOOLEAN

);

CREATE INDEX IF NOT EXISTS user_ix ON app_data.message_rooms(users) ;

CREATE TABLE IF NOT EXISTS messages (
	
	room_id UUID,
	message_id UUID,
	author TEXT,
	content TEXT,
    sent_at TIMESTAMP,

    PRIMARY KEY((room_id), sent_at)
    

) WITH CLUSTERING ORDER BY (sent_at ASC);