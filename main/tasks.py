import json
import redis
import docker
from datetime import datetime
from celery import shared_task
from celery.utils.log import get_task_logger


logger = get_task_logger(__name__)


if __name__ == '__main__':
    pass