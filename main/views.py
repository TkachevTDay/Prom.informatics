import json
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import viewsets
from .models import Project
from django.core.mail import send_mail
from .additional import color_mark_define

# Create your views here.
from .serializers import ProjectSerializer


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
        print(mark_filter)
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
            projects_by_filter = projects_by_filter.filter(mark = {'value': str(mark_filter), 'color' : color_mark_define(str(mark_filter))})
        if start is None:
            start = 0
        if number is None:
            number = len(projects_by_filter)
        queryset = projects_by_filter[int(start):int(start) + int(number)]
        return queryset
        #todo: fix problem with filter on '5+', '4+', '3+'-type values


class RecentProjectViewSet(viewsets.ModelViewSet):
    recent_projects_amount = 5
    queryset = Project.objects.order_by("-upload_date")[:recent_projects_amount]
    serializer_class = ProjectSerializer

def index_page(request):
    a = Project(name='b', author='s104', year='1984', mark = {'value' : '5', 'color' : color_mark_define('5')},images=['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ96lrvoXbEiXlbj9_Czn6FwsFICjdoxiN_KQ&usqp=CAU', 'https://play-lh.googleusercontent.com/p6kS3dCcILt9Z4vRMxHXZTbRecqnZTx5ysBVp6Qe3fDofokRLuWjRxF8J0TkMTG2gKo', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAqFBMVEV2wq////9PXXNyfY9loZLg4NFrvqnv9/Xj5ehndIe6ua0/UGnf4OT4+Pk7TGZqq5tanIvV5OBnpZXn59vq6ufFxbjL5t+Z0MK33dN9xbOm1clvv6z2+/rp9PHh8Oy+4NeNy7vJ5d6Rzb5hbYFYZXqg08Z+iJi+2NGewbjb5+Ryu6nI29arycHs6udpqZmttaixvrHQ3My61MTJ3tGBsKSOlqSco6+PvLACryVXAAALM0lEQVR4nNWdfYObNhLGIfXKybXJOns9MMgvLD43zW66bdL08v2/2QF+wdgIPTMaIfb5MzGg346YkUaDFMXetVpvku0yT8siy6JaWVaUab7cJpv1yv/jI583XyfLfaYq6UpRV/U/1f+V7ZfJ2mcjfBGuk7xoyCKbGtIi94bpg3C9TbUC2LqcSqdbH5TihEkeUelaTBXliXSDRAlXj2XVM3l0Z0hVPor6H0HCpHSkaylLQUtKEW5yIbwT5H4j1DIZwm0myndgzLYibRMgnMua7xIyn0+AcJN64jswps6d1ZFwU3jka6QKR0YnworPL54EowPhvByDr2EsHQY7bMJVPhZfw5izRwFcwq3v9+9KWnFjB49wk41pwCNjxnsdWYT78flqqf1IhAl36uAsrRnjVTphGsaAB6nUO+EmmAEP0pr6NhIJlyENeJDKPRKusrAGPEhnpNhIIdyEN+BBitJTCYQT6KEnqaUPwqA+9FqqFCecxivYCn8ZQcL1tPhqaXC+gRFOxsdcCvQ3EGEyRcAKERrDIYTbaQJWiMiMCiCcUJS4FhI17IQTBoQQrYSTBkQQbYQTBwQQLYSTdTKtbO5mmHCiYaIrS9AYJJxkoL/VcOgfIly/DsAKcWgAN0C4mt5Y1CQ9MAwfIMxCt5ugjEOYmk14qIQZXQNJMG3OwRkJzYFQ6/3jZj0fW+vN497MaA6LJkKjG9WZeD0IQYlxIm50qAbClQmQkiHxIuMYRBm8jYHQ5GXI+Vh5GdMNBm/TT7g03EULVA44a25qXH/36iU0vYSkPKU/0ZrXS0j7I40vYxfr+3EfoSkSDoTVkWVwE71RsYfQNKHgLN55UmKwQd80o4fQ5Kt6+0AgEdp4S7g3dfLOGvPbXyC9ldOv9Eb2E5oHM4/tj97vPvwM6c07Of32vm3AIz60uSE0zigur929QfXuJzn9Btjh1h1eE27NY9t2mvn2A0z4RpDwXdtRzZPzm7TNFaFxPFpd2o5nfvkZJ9wJEr49t2A+0M6r8ekVYW6egjEJBY2IEeqrdf4u4cCFbML/jkx4nbXpEpbm69iEcs4GJIy668MdwsHsIZtQzIgoYTdidAiLgcv4hGJGRAmjwkQ4nADmE0o5G5iwY8RLwkETuhDuRibsGPGC0JLDdyAUMiJOeGnEC8J08CInQhlngxNGaR+h7SIXQhlnQyC8aGxLODCccScU6acEwouBTUtoW2hyI9yNSxipW0LzpEKEUMKIFEK9vSG0rjQ5Eu7GJWzniSdC+3KvI6GAEUmE54BxIrT5GXdC94hBIjz7mhOhfUHbldA9YpAIz77mSGhKQEoSOvdTGuEpvXskHJoYihHuRiU8TRMPhAPpGUFCVyMSCY8JmwOhMf0oS+hoRCLhMcEboZ1UgtDRiETCYzeNQE8qQ+gWMaiEqiWEytckCN0iBpkwORPaw70UoVM/pRIegn5DCPxainA3ImEUnQixCj0ZQhcjkgmb3HBNaJ04SRI6OBsyYTOFqgkHKtjkCR2cDZ0wPRJiVZZShHwj0t9DfSAEC2WlCPlGpBPWL2IEzStECdnOhmHDpCGEoqEk4W48wrwhLKAfCxJyjUgnrNP7ETYolSVkOhsGoaoJ0Yp8QUKms+EQritC0NGIEvL6KYOwcjWRsdDPK+FuLMJlRWgqoPJKyDIih3BfEaKfVcgScozIIIyyihD9rSwhx4gcQhVHSJrNByEjYrAIVxH8+ZYwISNisAjXEfwFnjQhvZ+yCDcRGg7lCXdjEOokwib4PgjJRmQRbiM04HsgpBqRRbiMwLmTD0KqEVmEeWSpovFKSIwYHMKKD1my8EVIjBgswjIqQhLS+imLsIjgr329EO68E2aBCUlGZBLC8kNIcTYsQoL8EFKczSslJBjxlRISjPhaCXFnwyQM7EvfECLG64wWtTwTFuEJUWfDHNMEHZceBTob5rg05NziLI+EadD54Vk7b4TV/DDgHP9C/giXIfM0F4KMyMzThMu1deSNMAmYL+0IiRjMfGmwnPeVgIjBzHmHWre4kSfCVbC1pxvt/BAGWz/skRfCLNgacI+szoa7BhxkHb9XPgiXoWoxemUzIrcWI0Q9jUGWiMGtpwlQE2WUPCGprq3dbuI9YfcWknaDhLt2Cx604xWk2sTP5/vHP4Uw4rt/2gZ8JtUmgq5Gf2ofEP/zwY8Gdl3a/e/i+Z/ANieUGuHoR3yp92Or8/QfWJOPNcJgnXe0iKejBdbkY503WKsfPXyyPXc0fXrAAE+1+uA0/2E6RlyAhKfvLcAX8WXxe2iyo35fvEAtPn8zg333FN3PFs+B0Q56XszusSbXv8a/XasIZ4vPw88eRZ8XM4zw4ts1bPv8p9lsClasLDibPSENvvj+EByazmrEH6KHZtP1owacQe29+IYU+g646aY145dwmwnPvzR84Gt4+R0w8i13dDBihbh4+fL8EdQfv9r0B3qr5y/fFwdAzISdb7nBhNvTbHaCRPUvu/CbnR4PvYXd7/HBbnrspwQt/rQC/rmw36YrMFR09lSAUxkvEyDEov31vhhw1pRoRQ+EoAWv9zZBp8EX7yImgJB2Q+wd7NmfhnCkzNNDMMIHlK9njyHSiSRPT/egXv76j01/vaA3e8L5evaJQqdQROmvdzZ99fPg272+YF9De1Aowp792nBfQ5G2At7deXlu3557XorhMoDQx5lEvfsm2va+ZCkFCD08V/fufenjDDL9DSD8Jt9NDfuXxoX8kwDAuzv5v6xhD1oPRiwgwkL6scZ9hGPpRyl7rKj1Vfova9wLWtqIGvEztcCUNKqB/bzRaSIoJFQcJBswBvZkFz3xUOOAFaKgFdV8gFBqYKMrIYGi1bf6EplnD56NgCZseqV0kR61z//+N1V/5/vT5YV2acbw+Rb8KYbOJA/02rC7re2MEvbJlT2H9LgJLWS6lvWcGW7EKK/v4yyeXwfOCuL98UyHDzqI5RKQ857gRW/Ljd3F+VNDZ3ZxDnL2ciQbXJ/dCjx3DV3Xv7yzj4MR6R4BPTuP0U+nQth3G9IZluZbW843Z4kcmglnWMI1p2f5OPyRGpkp55DS764+igN+pHYk0lmy5GD0tJBeGJ4vKBnuyBySyWc69+t+tpC14ke4ouQESDzTeehc7n7C2eL7s9Rh3evn72hFyRmQfC43MSo2y4r4cjW0nk0h5JytTlyNoiwBgmKtNJEIVxQjeiAkPF0PDPwHCElZG3INg1WETnp14iFOSHKolIVhRFh95QFwcMw4SEiaZshaESy4aACHJzbDhPGWgPh0//Igo5d7gpe5SczQCIlhMYDMgRAknDqiFdBOOG1EOyBAOGVEABAhJLmbUWVzMjAhJzc1hixhgkLoY4nfXWByCCOM117Kepykh4ZqdMJ4JbnCJyCdoVl2lDCOyyn1VGWeD/IJpxQ1kCjBIJyOvyEloCmEE3kZ8VeQThjHeXgzUnoogzDeCNUTcKU1dYmEShjHaUgzEnwonzBOgplRc9YpGYTB3kbFWmlmEcabbHxGxSxn4RHWM6pxu6qGZkqShPFq1K6qcnaxB5swjuejeVVVgvMIYcLqdSzGYFSFU5WAE2HD6Pl9dORzJqzmxqlHRq1S5yoPZ8Lqfcw9MWqVC6ydCxBW2mbikFplMiUsMoTVCylryMp8UkVIUoSVklIIUqtSsE5OkLAaBTyWypFSK1U+ipZyihLWSvJIMScfWqsoF69yFCestN6mmkpZ0el06zB0McoHYa11khdVjwU4q98oVeSJD7pavggbrZPlPlOqIb1G1Q2ZUtl+6Q2ukVfCg1brTbJd5mlZZIcSnSwryjRfbpPNeoStYP4PTbKLQtmQBqoAAAAASUVORK5CYII='])
    a.save()
    a = Project(name='b', author='s104', year='1984', mark = {'value' : '3', 'color' : color_mark_define('3')}, images=[
        'https://lh3.googleusercontent.com/05m3CO1Wi8si9ienyCy78gqfVCDo9thVtCSdReNuFxrFedCMsy2NwQfLefqhFkGfNTz3UztUX2QTp1KkmaTykIp0y_M3ritQmSE4JA=w1064-v0',
        'https://w7.pngwing.com/pngs/754/627/png-transparent-computer-icons-font-awesome-icon-design-localizacao-black-map-location-thumbnail.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg/1024px-Edit_icon_%28the_Noun_Project_30184%29.svg.png'])
    a.save()

    if request.method == 'POST':
        body = request.body.decode('utf-8')
        name = json.loads(body)["currentAddName"]
        author = json.loads(body)["currentAddAuthor"]
        description = json.loads(body)['currentAddDescription']
        #todo: make tech stack
        department = json.loads(body)['currentAddDepartment']
        mark = json.loads(body)['currentAddMark']
        year = json.loads(body)['currentAddYear']
        item = Project(name = name, author = author, description = description, mark = {'value': mark, 'color':color_mark_define(mark)}, year = year, department = department)
        item.save()
        send_mail(
            'Новый проект выслан на модерацию.',
            f'Новый проект с именем { name}, автор { author } ожидает Вашей модерации.',
            'prominfnotification@yandex.ru',
            ['matgost@yandex.ru'],
            fail_silently=False,
        )
    return render(request, 'index.html', {})


def send_filter_params(request):
    departments = [dep['department'] for dep in list(Project.objects.all().values('department').distinct())]
    years = [ye['year'] for ye in list(Project.objects.all().values('year').distinct())]
    authors = [aut['author'] for aut in list(Project.objects.all().values('author').distinct())]
    marks = [mar['mark']['value'] for mar in list(Project.objects.all().values('mark').distinct())]

    return JsonResponse(
        {
            'departments': departments,
            'years': years,
            'authors': authors,
            'marks': marks,
        }
    )
