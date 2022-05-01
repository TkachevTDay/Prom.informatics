import docker
client = docker.from_env()
container = client.containers.run("simple-votings", detach=True, ports={'13300': '13300'})
print(container.id)

