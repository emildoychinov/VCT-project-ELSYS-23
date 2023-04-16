#!/bin/bash

docker-compose up -d cassandra

while [[ ! $(docker compose ps | grep 'cassandra') ]] ;do
	sleep 1
done

echo "Cassandra running..."
sleep 60 
echo "Cassandra is ready!"

docker cp server/cassandra/app.cql cassandra:media/
docker exec -it cassandra cqlsh -e "SOURCE 'media/app.cql'"

docker-compose up -d chat-1 chat-2 chat-3 nginx

