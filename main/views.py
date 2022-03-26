import json

from django.http import JsonResponse
from django.shortcuts import render
from .models import Project


# Create your views here.

def index_page(request):
    last_projects = Project.objects.all()
    if request.method == 'POST':
        projects_by_filter = Project.objects.all()
        body = request.body.decode('utf-8')
        filter_data = json.loads(body)
        name_filt = filter_data["name"]
        year_filt = filter_data["year"]
        department_filt = filter_data["department"]
        mark_filt = filter_data["mark"]
        author_filt = filter_data["author"]

        if name_filt:
            projects_by_filter = projects_by_filter.filter(name=name_filt)
        if year_filt:
            projects_by_filter = projects_by_filter.filter(year=year_filt)
        if department_filt:
            projects_by_filter = projects_by_filter.filter(department=department_filt)
        if mark_filt:
            projects_by_filter = projects_by_filter.filter(mark=mark_filt)
        if author_filt:
            projects_by_filter = projects_by_filter.filter(author=author_filt)
        print(projects_by_filter)

    context = {
        "last_projects": last_projects,
    }
    return render(request, 'index.html', context)


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
