import docker
import redis
"""
    Additional calc function's
"""

def container_run(container_name, image_name, ports, volumes):
    client = docker.from_env()
    container = client.containers.run(container_name, detach=True, ports={str(ports): str(ports)}, name=image_name, volumes=volumes)
    print(container.id)

def pop_avialable_port():
    r = redis.StrictRedis(host='redis', port=6379, db=0)
    avialable_ports = r.get('avialable_ports').decode('UTF-8').split()
    if len(avialable_ports) == 0:
        return 'No free ports'
    r.set('avialable_ports', ' '.join(avialable_ports[1:]))
    return avialable_ports[0]

def check_existing_containers(container_name):
    client = docker.from_env()
    return container_name in [container.name for container in client.containers.list(all=True)]