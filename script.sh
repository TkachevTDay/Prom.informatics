#!/bin/sh
python3 manage.py migrate
python3 manage.py collectstatic --noinput
python docker-scripts/start-container.py
daphne -b 0.0.0.0 --port 8080 prominformatics.asgi:application