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
            buttonColors: {
                'red': '#E53935',
                'green': '#7E57C2',
            },

            is_administrator: true,

            personalAccessToken: '',
            userId: 0,
            dialog: false,
            dialogAdd: false,
            dialogReg: false,
            dialogModera: false,
            userProjects: [{"name": "avtor", "description": "eto proect","load_date": "2019","department": "Online", "author": "matvey","mark":"5","status":"5","tech":"Django"},{"name": "avtor2","load_date": "2019","department": "Online", "description": "eto proect2", "author": "matvey2","mark":"4","load_date": "2022","tech":"Django"}],
            moderateProjects: [{"name": "avtor3", "description": "eto proect","load_date": "2019","department": "Online", "author": "matvey","mark":"5","tech":"Django"},{"name": "avtor4","load_date": "2019","department": "Online", "description": "eto proect2", "author": "matvey2","mark":"4","load_date": "2022","tech":"Django"}],
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
            items: [],
            markItems: [],
            departmentItems: [],
            authorItems: [],
            yearItems: [],
            recentProjects: [],
            baseUrl: 'http://0.0.0.0:8080/',
            carouselIterator: 0,
            images: [],
            filterShow: false,
            currentProjectImages: [],
            currentAddImgs: [],
            currentProjectAvatar: '',
            rules: {
              value: [val => (val || '').length > 0 || 'Это поле необходимо заполнить!']
            },
        };
    },
    computed: {
        formIsValid () {
            return (
              this.currentAddAuthor &&
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
        updateCurrentAddData: function(index = null, moderate = false){
            if (index != null) {
                if (moderate){
                    this.currentAddName=this.moderateProjects[index].name
                    this.currentAddDescription=this.moderateProjects[index].description
                    this.currentAddAuthor=this.moderateProjects[index].author
                    this.currentAddDepartment=this.moderateProjects[index].department
                    this.currentAddMark=this.moderateProjects[index].mark
                    this.currentAddYear=this.moderateProjects[index].load_date
                    this.currentAddTech=this.moderateProjects[index].tech
                }else{
                    this.currentAddName=this.userProjects[index].name
                    this.currentAddDescription=this.userProjects[index].description
                    this.currentAddAuthor=this.userProjects[index].author
                    this.currentAddDepartment=this.userProjects[index].department
                    this.currentAddMark=this.userProjects[index].mark
                    this.currentAddYear=this.userProjects[index].load_date
                    this.currentAddTech=this.userProjects[index].tech
                }
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
        get_on_moderate_projects: function (){
            let xhr = new XMLHttpRequest();
            let c = `${this.baseUrl}api/projects/?start=${this.items.length}&number=5&year=${encodeURIComponent(this.selectedYear)}&department=${encodeURIComponent(this.selectedDepartment)}&mark=${encodeURIComponent(this.selectedMark)}&author=${encodeURIComponent(this.selectedAuthor)}&name=${encodeURIComponent(this.searchText)}&status=${encodeURIComponent("OnModerate")}&format=json`
            xhr.open("GET", c, true);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let response=xhr.response;
                        let a = JSON.parse(response);
                        app.moderateProjects = app.moderateProjects.concat(a);
                    }
                }
            };
        },
        update: function (){
            let xhr = new XMLHttpRequest();
            let c = `${this.baseUrl}api/projects/?start=${this.items.length}&number=5&year=${encodeURIComponent(this.selectedYear)}&department=${encodeURIComponent(this.selectedDepartment)}&mark=${encodeURIComponent(this.selectedMark)}&author=${encodeURIComponent(this.selectedAuthor)}&name=${encodeURIComponent(this.searchText)}&status=${encodeURIComponent("Published")}&format=json`
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
                acceptProject: function(item){

            let xhr = new XMLHttpRequest();
            xhr.open("POST", `${this.baseUrl}`, true);
            let CSRF_token = document.querySelector('[name=csrfmiddlewaretoken]').value
            xhr.setRequestHeader("X-CSRFToken", CSRF_token);
            let data = {
                'operation': 'AcceptProject',
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
            this.update();
        },
        disableProject: function(item){

            let xhr = new XMLHttpRequest();
            xhr.open("POST", `${this.baseUrl}`, true);
            let CSRF_token = document.querySelector('[name=csrfmiddlewaretoken]').value
            xhr.setRequestHeader("X-CSRFToken", CSRF_token);
            let data = {
                'operation': 'DisableProject',
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
             }
            this.update();
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
                'operation': "sendProjectOnModerate".trim(),
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
    this.get_on_moderate_projects();
    this.getFilterParams();
    this.getRecentProjects();
  },
})
