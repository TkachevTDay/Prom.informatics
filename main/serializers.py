from rest_framework import serializers

from main.models import Project


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ['url', 'id', 'name', 'description', 'path_link', 'upload_date', 'last_open_date', 'author',
                  'department',
                  'mark', 'year', 'icon', 'images', 'tech_stack']