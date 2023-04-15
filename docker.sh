#!/bin/bash

#docker swarm init
# this creates the vot-project_chat image
#docker build -t chat-img -f Dockerfile.server .

docker compose up -d 
# this itself runs the docker-compose.yml file to build the needed replicas
#docker stack deploy --compose-file docker-compose.yml vot-project

#docker network create cassandra
#docker run --rm -d --name cassandra --hostname cassandra --network cassandra cassandra

