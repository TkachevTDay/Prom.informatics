from django.db import models
from django.utils import timezone


# Create your models here.
class Project(models.Model):
    name = models.CharField(default="", max_length=255)
    description = models.CharField(default="", max_length=2047)
    path_link = models.CharField(max_length=255)
    upload_date = models.IntegerField()
    last_open_date = models.DateTimeField(default=timezone.now)
    author = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    mark = models.CharField(max_length=10)


class Docker_ISO(models.Model):
    project_id = models.ForeignKey(to=Project, on_delete=models.CASCADE)
    link_to_iso = models.CharField(max_length=255)
