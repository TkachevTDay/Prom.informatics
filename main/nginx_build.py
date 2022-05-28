import redis, json


class NginxConfFile:
    def __init__(self, server_name='localhost', static_files_folder='/prominf/staticfiles/',
                 media_files_folder='/prominf/mediafiles/', client_max_body_size='100M'):
        self.head = f'events{{}}http{{ client_max_body_size {client_max_body_size}; upstream django {{ server web:8080 fail_timeout=0; }} server {{ expires off; listen 80; server_name {server_name}; location / {{ proxy_pass http://django; }} location /static/ {{ alias {static_files_folder}; }} location /media/ {{ alias{media_files_folder}; }} }}'
        self.result = self.head
        self.server_name = server_name
        self.static_files_folder = static_files_folder
        self.media_files_folder=media_files_folder
        self.client_max_body_size=client_max_body_size

    def create_nginx_config_file(self):
        r = redis.StrictRedis(host='redis', port=6379, db=0)
        active_containers = json.loads(r.get('active_containers').decode('UTF-8'))
        avialable_ports = json.loads(r.get('avialable_ports').decode('UTF-8'))['ports_const']
        for i in active_containers.keys():
            current_sub_domain = avialable_ports.index(int(active_containers[i]))
            guest_container_block_template = f'server {{ listen 80; server_name cont{current_sub_domain}.{self.server_name}; error_page 502 /custom502.html; location = /custom502.html{{ root /pages; internal; }} location / {{ proxy_set_header Host $http_host; proxy_set_header X-Real-IP $remote_addr; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto $scheme; proxy_pass http://unix:/etc/cont_{current_sub_domain}/run_config/gunicorn.sock; }} location /static/ {{ alias /prominf/mediafiles/{i}/staticfiles}} }}'
            self.result += guest_container_block_template
        return self.result