FROM python:3-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /books/
COPY . .
RUN apt-get update
RUN apt-get -y install vim nano
RUN apt-get -y install systemctl
RUN pip install -r requirements.txt
RUN python manage.py migrate
CMD gunicorn simple_books.asgi:application
