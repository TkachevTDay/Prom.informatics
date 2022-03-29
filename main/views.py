import json
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .models import Project, Images
from main import searchAlgorithm

# Create your views here.
from .serializers import ProjectSerializer, ImagesSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        start = self.request.query_params.get('start')
        number = self.request.query_params.get('number')
        name_filter = self.request.query_params.get('name')
        department_filter = self.request.query_params.get('department')
        author_filter = self.request.query_params.get('author')
        year_filter = self.request.query_params.get('year')
        mark_filter = self.request.query_params.get('mark')
        projects_by_filter = Project.objects.all()
        if name_filter:
            projects_by_filter = projects_by_filter.filter(
                id__in=searchAlgorithm.search_same(name_filter, projects_by_filter))
        if department_filter:
            projects_by_filter = projects_by_filter.filter(department=department_filter)
        if author_filter:
            projects_by_filter = projects_by_filter.filter(author=author_filter)
        if year_filter:
            projects_by_filter = projects_by_filter.filter(year=year_filter)
        if mark_filter:
            projects_by_filter = projects_by_filter.filter(mark=mark_filter)
        if start is None:
            start = 0
        if number is None:
            number = len(projects_by_filter)
        queryset = projects_by_filter[int(start):int(start) + int(number)]
        return queryset


class RecentProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.order_by("upload_date")[:5]
    serializer_class = ProjectSerializer


class ImagesViewsSet(viewsets.ModelViewSet):
    queryset = Images.objects.all()
    serializer_class = ImagesSerializer


def index_page(request):
    return render(request, 'index.html', {})


def send_filter_params(request):
    departments = [dep['department'] for dep in list(Project.objects.all().values('department').distinct())]
    years = [ye['year'] for ye in list(Project.objects.all().values('year').distinct())]
    authors = [aut['author'] for aut in list(Project.objects.all().values('author').distinct())]
    marks = [mar['mark'] for mar in list(Project.objects.all().values('mark').distinct())]

    return JsonResponse(
        {
            'departments': departments,
            'years': years,
            'authors': authors,
            'marks': marks,
        }
    )
