from django.db import models
from django.utils import timezone


# Create your models here.
class Project(models.Model):
    name = models.TextField(default="", max_length=255)
    description = models.TextField(default="", max_length=2047)
    path_link = models.TextField(max_length=255)
    year = models.TextField(default='', max_length=255)
    upload_date = models.DateTimeField()
    last_open_date = models.DateTimeField(default=timezone.now)
    author = models.TextField(max_length=255)
    department = models.TextField(max_length=255)
    mark = models.TextField(max_length=10)


class Images(models.Model):
    project_id = models.ForeignKey(to=Project, on_delete=models.CASCADE)
    src = models.TextField(max_length=255)
    status = models.TextField(max_length=255, default='ordinary')


class DockerISO(models.Model):
    project_id = models.ForeignKey(to=Project, on_delete=models.CASCADE)
    link_to_iso = models.TextField(max_length=255)
