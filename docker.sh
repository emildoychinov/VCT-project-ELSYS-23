#!/bin/bash

docker swarm init

# this creates the vot-project_chat image
docker-compose build 
# this itself runs the docker-compose.yml file to build the needed replicas
docker stack deploy --compose-file docker-compose.yml vot-project

