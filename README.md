# PromInformatics

Установка и запуск:

>1. `sudo docker-compose build` (только в первый раз / при изменении Dockerfile)
>2. `sudo docker-compose up`

Приостановка работы контейнеров:
>1. `sudo docker-compose down` or `CTRL+C`

Работа с базой:
(при запущенном контейнере, в новом терминале)
>`sudo docker exec -it db bash`\
> `psql -U [username] prominformatics_db`\
> Далее - sql-запросы


