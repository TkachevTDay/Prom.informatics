import json
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .models import Project
from django.core.mail import send_mail
from .serializers import ProjectSerializer
from .additional import container_run, pop_avialable_port, check_existing_containers, create_socket_files, uvicorn_start
import redis
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

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
        status = self.request.query_params.get('status')
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
        if status:
            projects_by_filter = projects_by_filter.filter(status= status)
        if start is None:
            start = 0
        if number is None:
            number = len(projects_by_filter)
        queryset = projects_by_filter[int(start):int(start) + int(number)]
        return queryset


class RecentProjectViewSet(viewsets.ModelViewSet):
    recent_projects_amount = 5
    queryset = Project.objects.all().filter(status='approved').order_by("-upload_date")[:recent_projects_amount]
    serializer_class = ProjectSerializer

def index_page(request):

    if request.method == 'POST':
        body = request.body.decode('utf-8')
        if json.loads(body)["requestType"] == 'elementAdd':
            name = json.loads(body)["currentAddName"]
            author = json.loads(body)["currentAddAuthor"]
            description = json.loads(body)['currentAddDescription']
            #todo: make tech stack
            department = json.loads(body)['currentAddDepartment']
            mark = json.loads(body)['currentAddMark']
            year = json.loads(body)['currentAddYear']
            images = json.loads(body)['currentAddImages']
            item = Project(name = name, author = author, description = description, mark = mark, year = year,
                           department = department, images = images, icon=images[0] if images else '')
            item.save()
            send_mail(
                'Новый проект выслан на модерацию.',
                f'Новый проект с именем { name }, автор { author } ожидает Вашей модерации.',
                'prominfnotification@yandex.ru',
                ['matgost@yandex.ru'],
                fail_silently=False,
            )
        if json.loads(body)["requestType"] == 'elementRun':

            current_element_id = json.loads(body)["elementId"]
            current_element = Project.objects.all().filter(id=current_element_id)[0]
            print(current_element.docker_status)
            cont_inf={}
            if current_element.docker_status == 'approved':
                    if not check_existing_containers(current_element.name.lower()):
                        ports_get_request = pop_avialable_port()
                        cont_inf['id'] = ports_get_request[-1]
                        if ports_get_request != 'No free ports':
                            container_run(container_name=current_element.name.lower(), image_name=current_element.docker_image_name,
                                          ports=ports_get_request,
                                          volumes={f'prominformatics_run_config_{ports_get_request[-1]}':{'bind': '/run/', 'mode': 'rw'},
                                                   'prominformatics_socket_files':{'bind':'/container_copy_files/', 'mode':'ro'}})
                            create_socket_files(current_element.name.lower())
                            uvicorn_start(current_element.name.lower())
                            return JsonResponse({'cont': cont_inf, 'status': 'ok'})
                        else:
                            return JsonResponse({'status': 'All ports are busy'})
                    else:
                        return JsonResponse({'status': 'Container with this name already exists'})
            else:
                return JsonResponse({'status': "There's no way to start this project with docker"})
        if json.loads(body)["requestType"] == 'elementChangeStatus':
            element = Project.objects.get(id=json.loads(body)["elementId"])
            element.status = json.loads(body)["elementNewStatus"]
            element.save(update_fields=['status'])
        if json.loads(body)["requestType"] == 'userAuth':
            username = json.loads(body)["username"]
            password = json.loads(body)["password"]
            user = authenticate(username=username, password=password)
            print(username)
            print(password)
            if user is not None:
                user = User.objects.get(username=username)
                print(user)
                login(request, user)
                return JsonResponse({'responseStatus': 'Successfully authenticated'})
            else:
                return JsonResponse({'responseStatus': 'Authentication failed (Incorrect input values)'})
        if json.loads(body)["requestType"] == 'userRegistry':
            if User.objects.filter(username=json.loads(body)["username"]):
                return JsonResponse({'responseStatus':'User with similar name already exists'})
            if User.objects.filter(email=json.loads(body)["email"]):
                return JsonResponse({'responseStatus':'User with similar E-mail already exists'})
            reg_user = User.objects.create_user(username=json.loads(body)["username"],
                                                password=json.loads(body)["password"], email=json.loads(body)["email"])
            if json.loads(body)["firstname"]:
                reg_user.firstname = json.loads(body)["firstname"]
            if json.loads(body)["secondname"]:
                reg_user.firstname = json.loads(body)["secondname"]
            reg_user.save()
            return JsonResponse({'responseStatus': 'Successfully saved'})
        if json.loads(body)["requestType"] == 'authCheck':
            if request.user.is_authenticated:
                return JsonResponse({'authStatus': 1})
            else:
                return JsonResponse({'authStatus': 0})
        if json.loads(body)["requestType"] == 'userUnAuth':
            logout(request)
            return JsonResponse({'responseStatus': 'Successfull unauth'})
    return render(request, 'index.html', {})


def send_filter_params(request):
    departments = [dep['department'] for dep in list(Project.objects.all().values('department').distinct())]
    years = [ye['year'] for ye in list(Project.objects.all().values('year').distinct())]
    authors = [aut['author'] for aut in list(Project.objects.all().values('author').distinct())]
    marks = [mar['mark'] for mar in list(Project.objects.all().values('mark').distinct())]
    projects_amount = len(Project.objects.all())
    return JsonResponse(
        {
            'departments': departments,
            'years': years,
            'authors': authors,
            'marks': marks,
            'db_len': projects_amount,
        }
    )
