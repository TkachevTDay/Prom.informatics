var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    vuetify: new Vuetify(),
    data(){
        return {
            dialog: false,
            selectedItem: 1,
            carousel: 0,
            selectedMark: '',
            selectedDepartment: '',
            selectedYear: '',
            searchText: '',
            selectedAuthor: '',
            items: [],
            markItems: [],
            departmentItems: [],
            authorItems: [],
            yearItems: [],
            recentProjects: [],
            baseUrl: 'http://127.0.0.1:8000/',
            carouselIterator: 0,
            images: [],
            currentProjectImages: [],
            currentProjectAvatar: '',
        }
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
        carouselNext: function(){
            if (this.recentProjects.length - 1 == this.carouselIterator){
                this.carouselIterator = 0
            }
            else{
                this.carouselIterator += 1

        }
        this.updateCurrentImagesList();
        },
        carouselPrev: function(){
            if (this.carouselIterator == 0){
                this.carouselIterator = this.recentProjects.length - 1

            }
            else{
                this.carouselIterator -= 1
            }
            this.updateCurrentImagesList();
        },
        update: function (){
            let xhr = new XMLHttpRequest();
            let c = `${this.baseUrl}api/projects/?start=${this.items.length}&number=2&year=${this.selectedYear}&department=${this.selectedDepartment}&mark=${this.selectedMark}&author=${this.selectedAuthor}&name=${this.searchText}&format=json`
            xhr.open("GET", c, true);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    let response=xhr.response;
                    let a = JSON.parse(response);
                    app.items = app.items.concat(a);
                }
            };
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
                    let response=xhr.response;
                    let a = JSON.parse(response);
                    app.images = a
                    app.updateCurrentImagesList();
                }
            };

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
                    let response=xhr.response;
                    let a = JSON.parse(response);
                    app.yearItems = a.years;
                    app.departmentItems = a.departments;
                    app.authorItems = a.authors;
                    app.markItems = a.marks;
                }
            };
        },
        getRecentProjects: function(){
            let xhr = new XMLHttpRequest()
            xhr.open("GET", `${this.baseUrl}api/recent_projects`, true);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    let response=xhr.response;
                    let a = JSON.parse(response);
                    app.recentProjects = a

                }
            };
        }
    },
  mounted(){
    this.update();
    this.getFilterParams();
    this.getRecentProjects();
    this.getImages();

  },
})
