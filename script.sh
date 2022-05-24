#!/bin/sh
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py collectstatic --noinput
echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('system', 'prominfnotification@yandex.ru', '1') if not (User.objects.filter(username='system')) else print('system user already exists') " | python manage.py shell
daphne -b 0.0.0.0 --port 8080 prominformatics.asgi:application