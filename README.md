# PromInformatics

Установка и запуск:

>1. `sudo docker build -t prominformatics .`
>2. `sudo docker run -t --rm -p 8080:8080 prominformatics:latest`

Container kill:
>1. `docker rm -f $(docker ps -a -q)`

