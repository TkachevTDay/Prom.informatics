import json
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .models import Project
from django.core.mail import send_mail
from .additional import color_mark_define

# Create your views here.
from .serializers import ProjectSerializer


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
        print(mark_filter)
        projects_by_filter = Project.objects.all()
        if name_filter:
            projects_by_filter = projects_by_filter.filter(name=name_filter)
        if department_filter:
            projects_by_filter = projects_by_filter.filter(department=department_filter)
        if author_filter:
            projects_by_filter = projects_by_filter.filter(author=author_filter)
        if year_filter:
            projects_by_filter = projects_by_filter.filter(year=year_filter)
        if mark_filter:
            projects_by_filter = projects_by_filter.filter(mark = mark_filter)
        if start is None:
            start = 0
        if number is None:
            number = len(projects_by_filter)
        queryset = projects_by_filter[int(start):int(start) + int(number)]
        return queryset


class RecentProjectViewSet(viewsets.ModelViewSet):
    recent_projects_amount = 5
    queryset = Project.objects.order_by("-upload_date")[:recent_projects_amount]
    serializer_class = ProjectSerializer

def index_page(request):

    if request.method == 'POST':
        body = request.body.decode('utf-8')
        name = json.loads(body)["currentAddName"]
        author = json.loads(body)["currentAddAuthor"]
        description = json.loads(body)['currentAddDescription']
        #todo: make tech stack
        department = json.loads(body)['currentAddDepartment']
        mark = json.loads(body)['currentAddMark']
        year = json.loads(body)['currentAddYear']
        images = json.loads(body)['currentAddImages']
        item = Project(name = name, author = author, description = description, mark = mark, year = year, department = department, images = images, icon=images[0] if images else '')
        item.save()
        send_mail(
            'Новый проект выслан на модерацию.',
            f'Новый проект с именем { name}, автор { author } ожидает Вашей модерации.',
            'prominfnotification@yandex.ru',
            ['matgost@yandex.ru'],
            fail_silently=False,
        )
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
