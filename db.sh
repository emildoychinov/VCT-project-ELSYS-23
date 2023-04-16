docker cp server/cassandra/app.cql cassandra:media/
docker exec -it cassandra cqlsh -e "SOURCE 'media/app.cql'"
