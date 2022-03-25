FROM python:3-alpine
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /prominf/
COPY . /prominf/
RUN pip install -r requirements.txt
