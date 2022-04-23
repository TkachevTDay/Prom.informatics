var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    vuetify: new Vuetify(),
    data(){
        return {
            dialog: false,
            dialogAdd: false,
            userProjects: [{"name": "avtor", "description": "eto proect","load_date": "2019","department": "Online", "author": "matvey","mark":5,"tech":"Django"},{"name": "avtor2","load_date": "2019","department": "Online", "description": "eto proect2", "author": "matvey2","mark":4,"load_date": "2022","tech":"Django"}],
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
            currentProjectAvatar: '',
        };
    },
    computed: {
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
        showDialog: function(){
            this.dialog = true;
        },
        showAddDialog: function(){
            this.dialogAdd = true;
        },
        showFilter: function(){
            this.filterShow = !this.filterShow
        },
        updateCurrentData: function(item = null){
            if (item == null) {
                this.currentName=this.recentProjects[this.carouselIterator].name
                this.currentDescription=this.recentProjects[this.carouselIterator].description
                this.currentAuthor=this.recentProjects[this.carouselIterator].author
                this.currentDepartment=this.recentProjects[this.carouselIterator].department
                this.currentMark=this.recentProjects[this.carouselIterator].mark
                this.currentYear=this.recentProjects[this.carouselIterator].year
            } else {
                this.currentName=item.name
                this.currentDescription=item.description
                this.currentAuthor=item.author
                this.currentDepartment=item.department
                this.currentMark=item.mark
                this.currentYear=item.year
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
            }

        },
        carouselNext: function(){
            if (this.recentProjects.length - 1 == this.carouselIterator){
                this.carouselIterator = 0
            }
            else{
                this.carouselIterator += 1

        }
        this.updateCurrentImagesList();
        this.updateCurrentData();
        },
        carouselPrev: function(){
            if (this.carouselIterator == 0){
                this.carouselIterator = this.recentProjects.length - 1

            }
            else{
                this.carouselIterator -= 1
            }
            this.updateCurrentImagesList();
            this.updateCurrentData();
        },
        update: function (){
            let xhr = new XMLHttpRequest();
            let c = `${this.baseUrl}api/projects/?start=${this.items.length}&number=5&year=${this.selectedYear}&department=${this.selectedDepartment}&mark=${this.selectedMark}&author=${this.selectedAuthor}&name=${this.searchText}&format=json`
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
        updateCurrentImagesList: function(){
            this.currentProjectImages = app.images.filter(i => (i.project_id - 1 == this.carouselIterator))
            this.currentProjectAvatar = app.images.filter(i => ((i.project_id - 1 == this.carouselIterator) && (i.status=='avatar')))[0]
        },
        getImages: function(){
            let xhr = new XMLHttpRequest();
            xhr.open("GET", `${this.baseUrl}api/images/?filter=json`, true);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        let response=xhr.response;
                        let a = JSON.parse(response);
                        app.images = a
                        app.updateCurrentImagesList();
                    }
                }
            };

        },
        filter: function() {
            let xhr = new XMLHttpRequest();
            let c = `${this.baseUrl}api/projects/?start=${this.items.length}&number=2&year=${this.selectedYear}&department=${this.selectedDepartment}&mark=${this.selectedMark}&author=${this.selectedAuthor}&name=${this.searchText}&format=json`
            xhr.open("GET", c, true);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        this.items = [];
                        let response=xhr.response;
                        let a = JSON.parse(response);
                        app.items = app.items.concat(a);
                    }
                }
            };
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
                'currentAddName': this.currentAddName,
                'currentAddDescription': this.currentAddDescription,
                'currentAddAuthor': this.currentAddAuthor,
                'currentAddTech': this.currentAddTech,
                'currentAddDepartment': this.currentAddDepartment,
                'currentAddMark': this.currentAddMark,
                'currentAddYear': this.currentAddYear,
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
    this.getImages();
  },
})
