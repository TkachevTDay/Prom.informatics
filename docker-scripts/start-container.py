import docker
client = docker.from_env()
container = client.containers.run("simple-votings", detach=True, ports={'8000': '8000'}, hostname="simple-votings")
print(container.id)

