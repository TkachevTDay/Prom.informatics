from rest_framework import serializers

from main.models import Project, Images


class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ['url', 'id', 'name', 'description', 'path_link', 'upload_date', 'last_open_date', 'author',
                  'department',
                  'mark', 'year']


class ImagesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Images
        fields = ['url', 'src', 'project_id', 'status']
