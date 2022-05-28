#!/bin/sh
python3 manage.py makemigrations
python3 manage.py migrate
if [ -e $HOME/clone.sh ]
then
  echo "file located, ERROR"
else
  touch clone.sh
fi
if [ -e $HOME/nginx_dynamically_build_files/nginx.conf ]
then
  echo "file located, ERROR"
else
  touch /prominf/nginx_dynamically_build_files/nginx.conf
  chmod 666 /prominf/nginx_dynamically_build_files/nginx.conf
fi
if [ -e $HOME/nginx_dynamically_build_files/nginx_build.sh ]
then
  echo "file located, ERROR"
else
  touch /prominf/nginx_dynamically_build_files/nginx_build.sh
  chmod 666 /prominf/nginx_dynamically_build_files/nginx_build.sh
fi
python3 manage.py collectstatic --noinput
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('system', 'prominfnotification@yandex.ru', '1') if not (User.objects.filter(username='system')) else print('system user already exists') " | python manage.py shell
daphne -b 0.0.0.0 --port 8080 prominformatics.asgi:application