import docker
client = docker.from_env()
container = client.containers.run("simple-votings", detach=True, ports={'8000': '8000'}, name="simple-votings", volumes={'prominformatics_containers_config_volume': {'bind': '/tmp_share_test/', 'mode': 'rw'}, 'prominformatics_containers_run':{'bind': '/run/', 'mode': 'rw'}})
print(container.id)

