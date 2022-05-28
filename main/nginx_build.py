import redis, json


class NginxConfFile:
    def __init__(self, server_name='localhost', static_files_folder='/prominf/staticfiles/',
                 media_files_folder='/prominf/mediafiles/', client_max_body_size='100M'):
        self.head = f'events {{\n}}\nhttp{{\n client_max_body_size {client_max_body_size};\n upstream django {{\n server web:8080 fail_timeout=0; \n}}\n server {{\n expires off;\n listen 80;\n server_name {server_name};\n location / {{\n proxy_pass http://django; \n}}\n location /static/ {{\n alias {static_files_folder}; \n}}\n location /media/ {{\n alias {media_files_folder}; \n}} \n}}\n'
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
            guest_container_block_template = f'server {{\n listen 80;\n server_name cont{current_sub_domain}.{self.server_name};\n error_page 502 /custom502.html;\n location = /custom502.html{{\n root /pages;\n internal;\n }}\n location / {{\n proxy_set_header Host \$http_host;\n proxy_set_header X-Real-IP \$remote_addr;\n proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\n proxy_set_header X-Forwarded-Proto \$scheme;\n proxy_pass http://unix:/etc/cont_{current_sub_domain}/run_config/gunicorn.sock;\n }}\n location /static/ {{\n alias /prominf/mediafiles/{i}/staticfiles;\n}}\n}}\n}}\n'
            self.result += guest_container_block_template
        return self.result