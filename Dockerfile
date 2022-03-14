FROM python:3-alpine
WORKDIR /prominf/
COPY . .
ENV ENV=dev
RUN pip install -r requirements.txt
CMD python3 manage.py runserver
