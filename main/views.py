import json

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
        # year_filt = request.POST.get("year")
        department_filt = filter_data["department"]
        mark_filt =  filter_data["mark"]

        if name_filt:
            projects_by_filter = projects_by_filter.filter(name=name_filt)
        # if year_filt:
        #     projects_by_filter.filter(upload_date = year_filt)
        if department_filt:
            projects_by_filter = projects_by_filter.filter(department=department_filt)
        if mark_filt:
            projects_by_filter = projects_by_filter.filter(mark=mark_filt)
        print(projects_by_filter)

    context = {
        "last_projects": last_projects,
    }
    return render(request, 'index.html', context)
