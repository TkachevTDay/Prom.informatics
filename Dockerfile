FROM python:3-alpine
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
RUN apk add --update docker
WORKDIR /prominf/
COPY . /prominf/
RUN apk add gcc musl-dev python3-dev libffi-dev openssl-dev cargo
RUN apk add --no-cache bash
RUN apk add git
RUN pip install -r requirements.txt
COPY /mediafiles/ /mediafiles/