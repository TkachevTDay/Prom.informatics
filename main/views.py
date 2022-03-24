from django.shortcuts import render
from .models import Project


# Create your views here.

def index_page(request):
    last_projects = Project.objects.all()
    if request.method == 'POST':
        if request.POST.get("sumbit_filter_form"):
            projects_by_filter = Project.objects.all()

            name_filt = request.POST.get("name")
            # year_filt = request.POST.get("year")
            department_filt = request.POST.get("department")
            mark_filt = request.POST.get("mark")

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
