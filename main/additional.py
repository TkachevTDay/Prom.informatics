import docker
import redis
import os
import subprocess
"""
    Additional calc function's
"""

def container_run(container_name, image_name, ports, volumes):
    client = docker.from_env()
    container = client.containers.run(image_name, detach=True, ports={str(ports): str(ports)}, name=container_name, volumes=volumes)
    print(container.id)

def pop_avialable_port():
    """
        Достать первый порт в списке (с последующим удалением) + проверка свободных портов
    """
    r = redis.StrictRedis(host='redis', port=6379, db=0)
    avialable_ports = r.get('avialable_ports').decode('UTF-8').split()
    if len(avialable_ports) == 0:
        return 'No free ports'
    r.set('avialable_ports', ' '.join(avialable_ports[1:]))
    return avialable_ports[0]

def check_existing_containers(container_name):
    client = docker.from_env()
    return container_name in [container.name for container in client.containers.list(all=True)]

def get_work_dir(container_name):
    client = docker.APIClient(base_url='unix://var/run/docker.sock')
    return client.inspect_container(container_name)['Config']['WorkingDir']

def get_asgi_address(container_name):
    client = docker.APIClient(base_url='unix://var/run/docker.sock')
    return client.inspect_container(container_name)['Args'][1].split()[1]

def create_socket_files(element_name):
    if not os.path.exists(f'/prominf/socketfiles/{element_name}/'):
        os.makedirs(f'/prominf/socketfiles/{element_name}/')
    socket_file = '[Unit]\nDescription=gunicorn socket\n\n[Socket]\nListenStream=/run/gunicorn.sock\n\n[Install]\nWantedBy=sockets.target\n'
    service_file = f'[Unit]\nDescription=gunicorn daemon\nRequires=gunicorn.socket\nAfter=network.target\n\n[Service]\nUser=root\nGroup=www-data\nWorkingDirectory={get_work_dir(element_name)}\nExecStart=/usr/local/bin/gunicorn --access-logfile - -k uvicorn.workers.UvicornWorker --workers 3 --bind unix:/run/gunicorn.sock {get_asgi_address(element_name)}\n\n[Install]\nWantedBy=multi-user.target'
    with open(f'/prominf/socketfiles/{element_name}/gunicorn.socket', 'w') as file:
        file.write(socket_file)
    with open(f'/prominf/socketfiles/{element_name}/gunicorn.service', 'w') as file:
        file.write(service_file)

def uvicorn_start(element_name):
    """
        Копирование сокет файлов в директорию и их запуск посредством systemctl
    """
    exec_file = f'#!/bin/bash\ndocker exec -i {element_name} ' \
                f'cp /container_copy_files/{element_name}/{{gunicorn.service,gunicorn.socket}} /etc/systemd/system/\ndocker exec -i {element_name} systemctl start gunicorn\n' \
                f'docker exec -i {element_name} systemctl enable gunicorn\ndocker exec -i {element_name} systemctl status gunicorn;'
    with open(f'/prominf/socketfiles/{element_name}/uvicorn_start.sh', 'w') as file:
        file.write(exec_file)
    os.chmod(f'/prominf/socketfiles/{element_name}/uvicorn_start.sh', 777)
    exit_code = subprocess.call(f'/prominf/socketfiles/{element_name}/uvicorn_start.sh')

def lead_to_useful_view(element):
    return element.split('/')[-1][0:-4]

def project_clone(element, personal_access_token):
    print()
    print(element)
    if not os.path.exists(f'/prominf/mediafiles/{element.path_link.split("/")[-1][0:-4]}/'):
        os.makedirs(f'/prominf/mediafiles/{element.path_link.split("/")[-1][0:-4]}/')
    os.chmod(f'/prominf/clone.sh', 777)

    clone_file=f'#!/bin/bash\ngit clone https://oauth2:{personal_access_token}@{"/".join(element.path_link.split("/")[2:])} /prominf/mediafiles/{element.path_link.split("/")[-1][0:-4]}'
    with open(f'/prominf/clone.sh', 'w') as file:
        file.write(clone_file)
    exit_code = subprocess.call(f'/prominf/clone.sh')