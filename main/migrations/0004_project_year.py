# Generated by Django 4.0.2 on 2022-03-26 18:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_alter_docker_iso_link_to_iso_alter_project_author_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='year',
            field=models.TextField(default='', max_length=255),
        ),
    ]