from django.db import models
from django.utils import timezone


# Create your models here.
class Project(models.Model):
    name = models.TextField(default="", max_length=255)
    description = models.TextField(default="", max_length=2047)
    path_link = models.TextField(max_length=255)
    upload_date = models.IntegerField()
    last_open_date = models.DateTimeField(default=timezone.now)
    author = models.TextField(max_length=255)
    department = models.TextField(max_length=255)
    mark = models.TextField(max_length=10)


class Docker_ISO(models.Model):
    project_id = models.ForeignKey(to=Project, on_delete=models.CASCADE)
    link_to_iso = models.TextField(max_length=255)
