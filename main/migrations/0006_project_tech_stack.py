# Generated by Django 4.0.4 on 2022-05-20 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_student'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='tech_stack',
            field=models.TextField(default='', max_length=700),
        ),
    ]
