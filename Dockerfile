FROM python:3-alpine
WORKDIR /prominf/
COPY . .
ENV ENV=dev
RUN pip install -r requirements.txt
RUN python3 manage.py makemigrations
RUN python3 manage.py migrate
