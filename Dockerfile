FROM python:3-alpine
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
RUN apk add --update docker
WORKDIR /prominf/
COPY . /prominf/
RUN pip install -r requirements.txt
