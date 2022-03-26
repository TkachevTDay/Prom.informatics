# Generated by Django 4.0.2 on 2022-03-26 11:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_project_description_project_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='docker_iso',
            name='link_to_iso',
            field=models.TextField(max_length=255),
        ),
        migrations.AlterField(
            model_name='project',
            name='author',
            field=models.TextField(max_length=255),
        ),
        migrations.AlterField(
            model_name='project',
            name='department',
            field=models.TextField(max_length=255),
        ),
        migrations.AlterField(
            model_name='project',
            name='description',
            field=models.TextField(default='', max_length=2047),
        ),
        migrations.AlterField(
            model_name='project',
            name='mark',
            field=models.TextField(max_length=10),
        ),
        migrations.AlterField(
            model_name='project',
            name='name',
            field=models.TextField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='project',
            name='path_link',
            field=models.TextField(max_length=255),
        ),
    ]
