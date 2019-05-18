ssh root@104.248.184.121


# Pull image

ssh root@104.248.184.121
docker pull nmajor/emailgate-docker-worker
docker tag nmajor/emailgate-docker-worker:latest emailgate-worker:latest


# Docker commands
DOCKER_HOST=tcp://104.248.184.121:2375 docker ps -a
