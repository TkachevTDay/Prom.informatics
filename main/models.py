from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save



class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    personal_access_token = models.CharField(max_length=255, default='no active gitlab connections')

# Create your models here.
class Project(models.Model):
    name = models.TextField(default="", max_length=255)
    description = models.TextField(default="", max_length=2047)
    path_link = models.TextField(max_length=255)
    year = models.TextField(default='', max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)
    last_open_date = models.DateTimeField(auto_now_add=True)
    author = models.TextField(max_length=255)
    department = models.TextField(max_length=255)
    mark = models.TextField(max_length=10)
    icon = models.TextField(max_length=255, default='https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Circle-icons-computer.svg/2048px-Circle-icons-computer.svg.png')
    images = models.JSONField(default=list)
    status = models.TextField(max_length=255, default='on moderate')
    docker_status = models.TextField(max_length=255, default='declined')
    docker_image_name = models.TextField(max_length=255, default='')

@receiver(post_save, sender = User)
def user_is_created(sender, instance, created, **kwargs):
    if created:
        Student.objects.create(user= instance)
    else:
        instance.student.save()