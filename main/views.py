from __future__ import absolute_import
import json
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .models import Project, Student, Notifications
from django.core.mail import send_mail
from .serializers import ProjectSerializer
from .additional import container_run, pop_avialable_port, check_existing_containers, create_socket_files, \
    uvicorn_start, project_clone, lead_to_useful_view, add_container_connection, element_build, get_port_by_name, \
    make_notification, request_valid_check
import base64
import redis
import shutil
from prominformatics.celery import kill_switch
import os
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core import serializers


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
        tech_stack=self.request.query_params.get('tech_stack')
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
        if tech_stack:
            projects_by_filter = projects_by_filter.filter(techStack=tech_stack)
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
        request_valid = request_valid_check(body)
        """
            Добавление проекта
        """
        if request_valid:
            if json.loads(body)["requestType"] == 'elementAdd':

                files = json.loads(body)["currentFiles"]
                name = json.loads(body)["currentAddName"]
                author = json.loads(body)["currentAddAuthor"]
                description = json.loads(body)['currentAddDescription']
                department = json.loads(body)['currentAddDepartment']
                mark = json.loads(body)['currentAddMark']
                year = json.loads(body)['currentAddYear']
                images = json.loads(body)['currentAddImages']
                path_link = json.loads(body)['currentAddPathLink']
                tech_stack = json.loads(body)['currentTechStack']
                item = Project(name = name, author = author, description = description, mark = mark, year = year,
                               department = department, images = images, icon=images[0] if images else '',
                               path_link=path_link, tech_stack=tech_stack, student_uploader=
                               Student.objects.get(user_id=request.user.id))

                if not os.path.exists(f'/prominf/mediafiles/images/{lead_to_useful_view(item.path_link)}/'):
                    os.makedirs(f'/prominf/mediafiles/images/{lead_to_useful_view(item.path_link)}/')
                for it, i in enumerate(files):
                    if it == 0:
                        item.icon = f"/media/images/{lead_to_useful_view(item.path_link)}/{it}.png"
                    tmp = base64.urlsafe_b64decode(i.split('base64,')[1])
                    save_path = f"/prominf/mediafiles/images/{lead_to_useful_view(item.path_link)}/{it}.png"
                    with open(save_path, "wb") as fh:
                        fh.write(tmp)
                    print('success')
                    item.images.append({'type': 'image', 'src': f"/media/images/{lead_to_useful_view(item.path_link)}/{it}.png"})
                item.save()
                send_mail(
                    'Новый проект выслан на модерацию.',
                    f'Новый проект с именем { name }, автор { author } ожидает Вашей модерации.',
                    'prominfnotification@yandex.ru',
                    ['matgost@yandex.ru'],
                    fail_silently=False,
                )
                return JsonResponse({'status': 'success'})
            """
                Запуск проекта
            """
            if json.loads(body)["requestType"] == 'elementRun':

                current_element_id = json.loads(body)["elementId"]
                current_element = Project.objects.all().filter(id=current_element_id)[0]
                print(current_element.docker_status)
                cont_inf={}
                if current_element.docker_status == 'approved':
                        if not check_existing_containers(lead_to_useful_view(current_element.path_link)):
                            ports_get_request = pop_avialable_port()
                            cont_inf['id'] = ports_get_request[-1]
                            if ports_get_request != 'No free ports':
                                container_run(container_name=lead_to_useful_view(current_element.path_link), image_name=current_element.docker_image_name,
                                              ports=ports_get_request,
                                              volumes={f'prominformatics_run_config_{ports_get_request[-1]}':{'bind': '/run/', 'mode': 'rw'},
                                                       'prominformatics_socket_files':{'bind':'/container_copy_files/', 'mode':'ro'}})

                                create_socket_files(lead_to_useful_view(current_element.path_link))
                                uvicorn_start(lead_to_useful_view(current_element.path_link))
                                add_container_connection(lead_to_useful_view(current_element.path_link), ports_get_request)
                                return JsonResponse({'cont': cont_inf, 'status': 'ok'})
                            else:
                                return JsonResponse({'status': 'All ports are busy'})
                        else:
                            cont_inf['id'] = get_port_by_name(lead_to_useful_view(current_element.path_link))[-1]
                            return JsonResponse({'cont': cont_inf, 'status': 'Container with this name already exists'})
                else:
                    return JsonResponse({'status': "There's no way to start this project with docker"})
            """
                Изменение статуса проекта (модерация)
            """
            if json.loads(body)["requestType"] == 'elementChangeStatus':
                if request.user.is_superuser == 't':
                    element = Project.objects.get(id=json.loads(body)["elementId"])
                    print('element:', element)
                    print(element)
                    status = json.loads(body)["elementNewStatus"]
                    docker_status = json.loads(body)["elementNewDockerStatus"]
                    if status == 'approved':
                        if element.tech_stack == 'Django-project':
                            if docker_status == 'approved':
                                make_notification(user_sender_id=Student.objects.get(user=User.objects.get(username='system')).id,
                                                  user_receiver_id=element.student_uploader_id,
                                                  message=f'Ваш проект с именем {element.name} успешно прошёл модерацию и '
                                                          f'доступен для запуска через докер.')
                                email = Student.objects.get(id=element.student_uploader_id).user.email
                                print('student:', Student.objects.get(id=element.student_uploader_id))
                                print('personal_access_token:',  Student.objects.get(id=element.student_uploader_id).personal_access_token)
                                project_clone(element, Student.objects.get(id=element.student_uploader_id).personal_access_token)
                                element.docker_image_name = element_build(element)
                                element.save(update_fields=['docker_image_name'])
                                element.status = status
                                element.docker_status = docker_status
                                element.save(update_fields=['status', 'docker_status'])
                                return JsonResponse({'responseStatus': 'Successful build'})
                            else:
                                make_notification(
                                    user_sender_id=Student.objects.get(user=User.objects.get(username='system')).id,
                                    user_receiver_id=element.student_uploader_id,
                                    message=f'Ваш проект с именем {element.name} успешно прошёл модерацию.', email=Student.objects.get(id=element.student_uploader_id).user.email)
                                element.status = status
                                element.docker_status = docker_status
                                element.save(update_fields=['status', 'docker_status'])
                                return JsonResponse({'responseStatus': 'Not avialiable (not Django project)'})
                        else:
                            element.status = status
                            element.docker_status = docker_status
                            element.save(update_fields=['status', 'docker_status'])
                            return JsonResponse({'responseStatus': 'Successful moderation for non-django project'})
                    else:
                        element.status = status
                        element.docker_status = docker_status
                        element.save(update_fields=['status', 'docker_status'])
                        shutil.rmtree(f"/prominf/mediafiles/images/{lead_to_useful_view(element.path_link)}")
                        make_notification(
                            user_sender_id=Student.objects.get(user=User.objects.get(username='system')).id,
                            user_receiver_id=element.student_uploader_id,
                            message=f'Ваш проект с именем {element.name} не прошёл модерацию. Комментарий администратора: {json.loads(body)["elementAnswer"]}', email=Student.objects.get(id=element.student_uploader_id).user.email)
                        return JsonResponse({'responseStatus': 'Successful declined moderation'})
            """
                Аутентификация пользователя
            """
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
            """
                Регистрация
            """
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
                make_notification(user_receiver_id=reg_user.id,
                                  user_sender_id=Student.objects.get(user=User.objects.get(username='system')).id,
                                  message ="Добро пожаловать на сайт курса 'Промышленное программирование'!")
                return JsonResponse({'responseStatus': 'Successfully saved'})
            """
                Проверка статуса пользователя
            """
            if json.loads(body)["requestType"] == 'authCheck':

                response = {}
                if request.user.is_authenticated:
                    response['authStatus'] = 1
                    response['currentUser'] = serializers.serialize('json', [request.user, ])
                    if Student.objects.get(user_id=request.user.id).personal_access_token != 'no active gitlab connections':
                        response['gitlabStatus'] = 1
                        print(Student.objects.get(user_id=request.user.id))
                        response['privateAccessToken'] = Student.objects.get(user_id=request.user.id).personal_access_token
                        return JsonResponse(response)
                    else:
                        response['gitlabStatus'] = 0
                        return JsonResponse(response)
                else:
                    response['authStatus'] = 0
            """
                Выход из учётной записи
            """
            if json.loads(body)["requestType"] == 'userUnAuth':
                logout(request)
                return JsonResponse({'responseStatus': 'Successfull unauth'})
            """
                Аутентификация через гитлаб
            """
            if json.loads(body)["requestType"] == "gitlabAuth":
                element = Student.objects.get(user_id=request.user.id)
                if element.personal_access_token == 'no active gitlab connections':
                    element.personal_access_token = json.loads(body)["personalAccessToken"]
                    element.save(update_fields=['personal_access_token'])
                    return JsonResponse({'responseStatus' : 'Successfully gitlab authorize'})
                else:
                    return JsonResponse({'responseStatus': 'Unsuccessfully gitlab authorize'})
            """
                Проверка уведомлений
            """
            if json.loads(body)["requestType"] == "elementCheckNotifications":
                if request.user.is_authenticated:
                    element = Student.objects.get(user_id=request.user.id)
                    notifications = Notifications.objects.filter(user_receiver=element)
                    length = len(Notifications.objects.filter(user_receiver=element, read="unread"))
                    return JsonResponse({'responseStatus': serializers.serialize('json', notifications), 'len': length })
                else:
                    return JsonResponse({'responseStatus': 'userNotAuth'})
            """
                Пометить как прочитанные
            """
            if json.loads(body)["requestType"] == "elementMakeRead":
                for i in list(json.loads(body)["notifications"]):
                    element = Notifications.objects.get(id=i['pk'])
                    element.read = "read"
                    element.save(update_fields=['read'])
                return JsonResponse({'responseStatus': 'success'})
            """
                Экстренное убийство запущенных контейнеров
            """
            if json.loads(body)["requestType"] == "emergency":
                if request.user.is_superuser == 't':
                    kill_switch(emergency=True)
            """
                Проверка супер-пользователя
            """
            if json.loads(body)["requestType"] == "adminVerify":
                return JsonResponse({'status': request.user.is_superuser})
                # Использовать в экстренных случаях
    return render(request, 'index.html', {})


def send_filter_params(request):
    departments = [dep['department'] for dep in list(Project.objects.filter(status='approved').values('department').distinct())]
    years = [ye['year'] for ye in list(Project.objects.filter(status='approved').values('year').distinct())]
    authors = [aut['author'] for aut in list(Project.objects.filter(status='approved').values('author').distinct())]
    marks = [mar['mark'] for mar in list(Project.objects.filter(status='approved').values('mark').distinct())]
    projects_amount = len(Project.objects.filter(status='approved'))
    return JsonResponse(
        {
            'departments': departments,
            'years': years,
            'authors': authors,
            'marks': marks,
            'db_len': projects_amount,
        }
    )
