ssh root@142.93.29.187


# Pull image

ssh root@142.93.29.187
docker pull nmajor/emailgate-docker-worker
docker tag nmajor/emailgate-docker-worker:latest emailgate-worker:latest


# Docker commands
DOCKER_HOST=tcp://142.93.29.187:2375 docker ps -a
