var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    vuetify: new Vuetify(),
    data(){
        return {
            markColors: {
                '2-': '#E53935',
                '2': '#E53935',
                '2+': '#E53935',
                '3-': '#FDD835',
                '3': '#FFA726',
                '3+': '#FDD835',
                '4-': '#B9F6CA',
                '4': '#69F0AE',
                '4+': '#00E676',
                '5-': '#00C853',
                '5': '#9575CD',
                '5+': '#7E57C2',
            },
            departmentIcons: {
                'Физтехпарк': 'https://gitlab.informatics.ru/uploads/-/system/group/avatar/1839/Untitled-1.png',
                'Профсоюзная': 'https://gitlab.informatics.ru/uploads/-/system/group/avatar/1837/pf.png',
                'ВШЭ': 'https://gitlab.informatics.ru/uploads/-/system/group/avatar/1838/hse.png',
                'Яндекс': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEUAAAD////8/Pw9PT3u7u53d3eDg4PV1dWZmZlcXFz09PTIyMhra2vi4uL4+PgmJibCwsKxsbGMjIzo6OjY2NhXV1eXl5crKyscHByOjo6hoaG9vb1xcXE6OjpFRUVhYWGsrKwQEBAYGBhPT08MDAwyMjI1LpfBAAAFAklEQVR4nO2dW1fqMBBGWxQVFBVR8S7e/v9fPOjRo8w3yRR80N0z+5Vkre5V2mSSybRpkiRJkiRJkiRJkiRJkiRJkiRJkiRJkuQ73I0OboY1Ln76Cr/DznQybiO2fvoqN+XxcjeUe2UANbybdtLDGt7td/WDGna+f1DDnXX8gIaPx+sJ4gxH8ejANlzzH8ozvFpfkGV4vYEgynAjQZJhQXAw211hgDVcuHr7N7bdNtXQfYtOX7Qh1fDJ8du99VpCDR8O9Q+64zeFGmooOC5dONNQH8Lteakt0nBuR4B2fFRsjDSUeHdwV25MNDyQ/+iw0ppoOLOC+7XWQEN5zYyfa82BhvaS25O1mv9+Q7mFs3p7nuHEGhbmMh/gDO+t4GHQAWcoY+FV0IFmeGEF2+J07R2a4bkVPI160AzlPbMX9YAZHsmf9CnqAjM8sYLBYNjgDE+tYXVK+gbL8Fl2KS7DPizDM3kMD8I+LEOZkw7Ksf0HLEOZ0ERTtoZmKKNh/CplGR7JClT8KmUZblnBdhF3QhlK5BTP2WCGMqNpz+NOKEPNmwni+1dQhppYUlsofQdlqLld8ZSGZag7TqO4E8pQIov2LO6EMpTl/PY+7oQylNXuVvIS4k4ww769S2XiHWxZvIEy1Hdp3+Y0Oh5GC94NzFDnNNdxJ5ShZrLtxp1QhppOuh13QhlqfNi3dZpbMewwbUMZPmraehwgogydqXc8XLAM9WUabh/CDDUb6jDaAoYZHmlaaRjlswydB3EadYEZ7onhOOoCM3wRwzDMhxk6AdRx0INmeKM3MTibTTNsdFqzqHfAGWp8EewD4wwvdEish8E4Q+/MYTVriGfoPInVOBhoqLuI1YkN0NBZNq0lDhENdTu/FgkTDd0DzsW1YaShE2Isx4zCqQumoR7tWrLtb0QxDZuRY9i2Ey8chho6geLf+zi9t3M4qmG5Yst4tj+92vvHpZ3lYQydjahucAydYLhvhhveRZLhZoooQ79yRK8Mm8veGzYjzUDpmeH6DyPPsPfVzJZsrXUbiYZNM1yjphnTsDgTT0MO89UIYnI2+uDMLnlADU0s9XVdyr5qmYZm9W1l17QfhiaQWjlJ0wtDu2qz8mMvDM0i+Ooafx8MrcO8+ivR0IQXZmO/B4a2kIRJV+yBoTGwmW58Q5vNZ9f28YZ2q03OPuMNbWwoZ0zohjb1eyAt6IZ2x1tzhuGGQ3v5mj0EN7SrF05SBttQInunBibaUDLAvCISaEPZJfUOPpMNJa9m4rUiG8pCsJuMATaUkkp+Ah/YUNLb/EPBXEM72LfjB7cd11A2DguHvLCGUiKyVASTavgo6d6lbG+qoeYoOB9+eANqOBfB4qluqKHu+hYr1TANtX5i+Swp01BzhMtFTpCGMtjXTlwgDbXWUKXGCdFQU710he0ToqGmsS8qrYGGTkJi7ZAlz9A5Clw9nsczdL5ZWfnKDNBQB/ugDA/O0Mlfr5dVoBlqZQx/he0TmqGTEhyUqIEZOudHo7IRLMMHJ480KkrHMnQG+9qE7Q2U4Ytz7HARdUIZet9Wdb9b+RWSoXfCOapswjL0Tv+GH2EhGTqDfYdSXyRDp9BAl2rXHENnsO9SGBJk6B0a6VB0nmPo1VHocgsxhg+OYJdvP3AMvcNbHT6j0zjP7y81HDp0KMi+ZMt2C2qDJUmSJEmSJEmSJEmSJEmSJEmSJEmSJP8nfwC0HjLVVuzjWwAAAABJRU5ErkJggg==',
                'Мытищи': 'https://gitlab.informatics.ru/uploads/-/system/group/avatar/1840/mytischi.png',
                'Королёв': 'https://gitlab.informatics.ru/uploads/-/system/group/avatar/1842/korolev.png?width=64',
                'Пушкино': 'https://gitlab.informatics.ru/uploads/-/system/group/avatar/1841/pushkino.png',
                'Щёлково': 'https://ia.wampi.ru/2022/05/03/LOGO-SELKOVO.png',
                'Проспект Мира': 'https://gitlab.informatics.ru/uploads/-/system/group/avatar/1836/pm.png',
                'Онлайн': 'https://gitlab.informatics.ru/uploads/-/system/group/avatar/1844/online.png',
                'Виртуальный класс': 'https://gitlab.informatics.ru/uploads/-/system/group/avatar/1843/vk.png',
            },
            personalAccessToken: '',
            userId: 0,
            dialog: false,
            dialogAdd: false,
            dialogReg: false,
            userProjects: [{"name": "avtor", "description": "eto proect","load_date": "2019","department": null, "author": "matvey","mark":"5","tech":"Django"},{"name": "avtor2","load_date": "2019","department": null, "description": "eto proect2", "author": "matvey2","mark":"4","load_date": "2022","tech":"Django"}],
            selectedItem: 1,
            carousel: 0,
            selectedMark: '',
            selectedDepartment: '',
            selectedYear: '',
            searchText: '',
            selectedAuthor: '',
            isCardModeratable: false,
            currentName: '',
            currentDescription: '',
            currentAuthor: '',
            currentDepartment: '',
            currentMark: '',
            currentYear: '',
            currentAddName: '',
            currentAddDescription: '',
            currentAddAuthor: '',
            currentAddTech: '',
            currentAddImg: '',
            currentAddDepartment: '',
            currentAddMark: '',
            currentAddYear: '',
            currentAddPathLink: '',
            departments: ['Физтехпарк', 'Профсоюзная', 'Проспект Мира', 'ВШЭ', 'Яндекс', 'Мытищи', 'Королёв', 'Пушкино', 'Щёлково', 'Онлайн', 'Виртуальный класс'],
            items: [],
            markItems: [],
            departmentItems: [],
            authorItems: [],
            yearItems: [],
            recentProjects: [],
            baseUrl: 'http://0.0.0.0:1337/',
            carouselIterator: 0,
            images: [],
            filterShow: false,
            currentProjectImages: [],
            currentAddImgs: [],
            currentProjectAvatar: '',
            err: false,
            rules: {
              value: [val => (val || '').length > 0 || 'Это поле необходимо заполнить!']
            },
        };
    },
    computed: {
        checkURL () {
            return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(this.currentAddImg);
        },
        formIsValid () {
            return (this.currentAddAuthor &&
              this.currentAddDepartment &&
              this.currentAddDescription &&
              this.currentAddMark && this.currentAddName && this.currentAddName && this.currentAddTech && this.currentAddYear
            )
          },
        columns() {
            if (this.$vuetify.breakpoint.xl) {
                return 4;
            }
            if (this.$vuetify.breakpoint.lg) {
                return 3;
            }
            if (this.$vuetify.breakpoint.md) {
                return 2;
            }
            return 1;
        }
    },
    methods: {

        getId: function(){
            let xhr = new XMLHttpRequest();
            let c = `https://gitlab.informatics.ru/api/v4/personal_access_tokens`
            xhr.open("GET", c, true);
            xhr.setRequestHeader('PRIVATE-TOKEN', `${this.personalAccessToken}`)
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let response=xhr.response;
                        let a = JSON.parse(response);
                        app.userId = a[0].user_id;
                    }
                }
            };

        },
        getUserProjects: function(){
            let xhr = new XMLHttpRequest();
            let c = `https://gitlab.informatics.ru/api/v4/users/${app.userId}/projects`
            xhr.open("GET", c, true);
            xhr.setRequestHeader('PRIVATE-TOKEN', `${this.personalAccessToken}`)
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let response=xhr.response;
                        let a = JSON.parse(response);
                        app.userProjects = a;
                        alert(app.userProjects);
                    }
                }
            };
        },
        registry: function(){
            this.getId();
            this.getUserProjects();
        },
        showDialog: function(){
        this.currentProjectImages=[];
            this.dialog = !this.dialog;
        },
        showAddDialog: function(){
            this.currentProjectImages=[];
            this.dialogAdd = true;
        },
        showFilter: function(){
            this.filterShow = !this.filterShow
        },
        uploadImg: function(){
            this.currentProjectImages.push(this.currentAddImg);
            this.currentAddImg = '';
        },
        updateCurrentData: function(item = null){
            if (item == null) {
                this.currentName=this.recentProjects[this.carouselIterator].name
                this.currentDescription=this.recentProjects[this.carouselIterator].description
                this.currentAuthor=this.recentProjects[this.carouselIterator].author
                this.currentDepartment=this.recentProjects[this.carouselIterator].department
                this.currentMark=this.recentProjects[this.carouselIterator].mark
                this.currentYear=this.recentProjects[this.carouselIterator].year
                this.currentProjectImages=this.recentProjects[this.carouselIterator].images
                this.currentProjectAvatar=this.recentProjects[this.carouselIterator].icon
            } else {
                this.currentName=item.name
                this.currentDescription=item.description
                this.currentAuthor=item.author
                this.currentDepartment=item.department
                this.currentMark=item.mark
                this.currentYear=item.year
                this.currentProjectImages=item.images
                this.currentProjectAvatar=item.icon
            }

        },
        updateCurrentAddData: function(index = null){
            if (index != null) {
                this.currentAddName=this.userProjects[index].name
                this.currentAddDescription=this.userProjects[index].description
                this.currentAddAuthor=this.userProjects[index].author
                this.currentAddDepartment=this.userProjects[index].department
                this.currentAddMark=this.userProjects[index].mark
                this.currentAddYear=this.userProjects[index].year
                this.currentAddTech=this.userProjects[index].tech
                this.currentAddPathLink=this.userProjects[index].http_url_to_repo
            }

        },
        carouselNext: function(){
            if (this.recentProjects.length - 1 == this.carouselIterator){
                this.carouselIterator = 0
            }
            else{
                this.carouselIterator += 1

        }
        this.updateCurrentData();
        },
        carouselPrev: function(){
            if (this.carouselIterator == 0){
                this.carouselIterator = this.recentProjects.length - 1

            }
            else {
                this.carouselIterator -= 1
            }
            this.updateCurrentData();
        },
        update: function (){
            let xhr = new XMLHttpRequest();
            let c = `${this.baseUrl}api/projects/?start=${this.items.length}&number=5&year=${encodeURIComponent(this.selectedYear)}&department=${encodeURIComponent(this.selectedDepartment)}&mark=${encodeURIComponent(this.selectedMark)}&author=${encodeURIComponent(this.selectedAuthor)}&name=${encodeURIComponent(this.searchText)}&format=json`
            xhr.open("GET", c, true);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let response=xhr.response;
                        let a = JSON.parse(response);
                        app.items = app.items.concat(a);
                    }
                }
            };
        },
        setModeratableState(state){
            this.isCardModeratable = state
        },

        filter: function() {
            this.items = [];
            this.update();
        },
        getFilterParams: function(){
            let xhr = new XMLHttpRequest();
            xhr.open("GET", `${this.baseUrl}api/filter_params`, true);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let response=xhr.response;
                        let a = JSON.parse(response);
                        app.yearItems = a.years;
                        app.departmentItems = a.departments;
                        app.authorItems = a.authors;
                        app.markItems = a.marks;
                    }
                }
            };
        },
        getRecentProjects: function(){
            let xhr = new XMLHttpRequest()
            xhr.open("GET", `${this.baseUrl}api/recent_projects`, true);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let response=xhr.response;
                        let a = JSON.parse(response);
                        app.recentProjects = a
                        app.updateCurrentData()
                    }
                }
            };
        },

        sendProjectOnModerate: function(item){
            let xhr = new XMLHttpRequest();
            xhr.open("POST", `${this.baseUrl}`, true);
            let CSRF_token = document.querySelector('[name=csrfmiddlewaretoken]').value
            xhr.setRequestHeader("X-CSRFToken", CSRF_token);
            let data = {
                'currentAddName': this.currentAddName.trim(),
                'currentAddDescription': this.currentAddDescription.trim(),
                'currentAddAuthor': this.currentAddAuthor.trim(),
                'currentAddTech': this.currentAddTech.trim(),
                'currentAddDepartment': this.currentAddDepartment.trim(),
                'currentAddMark': this.currentAddMark.trim(),
                'currentAddYear': this.currentAddYear.trim(),
                'currentAddImages': this.currentProjectImages,
            }
            xhr.send(JSON.stringify(data))
             xhr.onreadystatechange = function() {
              if (xhr.readyState == 4) {
                console.log('POST-request with add config has been successfully sent')
              }
            };

        },
    },
  mounted(){
    this.update();
    this.getFilterParams();
    this.getRecentProjects();
  },
})
