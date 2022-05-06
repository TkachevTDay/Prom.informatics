import docker
"""
    Additional calc function's
"""

def container_run(container_name, image_name, ports):
    client = docker.from_env()
    container = client.containers.run(container_name, detach=True, ports={str(ports): str(ports)}, name=image_name)
    print(container.id)

