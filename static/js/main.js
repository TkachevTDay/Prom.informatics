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
            isAdministrator: 0,
            isAuthorized: 0,
            personalAccessToken: '',
            userId: 0,
            authorizeLogin: '',
            authorizePass: '',
            dialog: false,
            dialogAdd: false,
            dialogReg: false,
            dialogAdm: false,
            dialogLog: false,
            dialogGitlabAuth: false,
            userProjects: [{"name": "avtor", "description": "eto proect","load_date": "2019","department": "Online", "author": "matvey","mark":"5","tech":"Django"},{"name": "avtor2","load_date": "2019","department": "Online", "description": "eto proect2", "author": "matvey2","mark":"4","load_date": "2022","tech":"Django"}],
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
            items: [],
            markItems: [],
            departmentItems: [],
            authorItems: [],
            yearItems: [],
            recentProjects: [],
            baseUrl: 'http://localhost:1337/',
            carouselIterator: 0,
            images: [],
            filterShow: false,
            currentProjectImages: [],
            currentAddImgs: [],
            currentProjectAvatar: '',
            moderateProjects: [],
            changedStatus: '',
            userInf: '',
            err: false,
            currentCSRF: '',
            userNameReg: '',
            firstNameReg: '',
            secondNameReg: '',
            emailReg: '',
            passwordReg: '',
            registryResponse: '',
            authResponse: '',
            profileMenu: '',
            gitlabAuthResponse: '',
            dialogAuthInstruction: false,
            currentUser: '',
            rules: {
              value: [val => (val || '').length > 0 || 'Это поле необходимо заполнить!'],
               emailRules: [
                            v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Введите корректный e-mail'
                            ],
               authorizeHint: [v => (this.authResponse.responseStatus != 'Authentication failed (Incorrect input values)') || 'Проверьте правильность заполненных данных']
            },
        };
    },
    computed: {
        checkURL () {
            return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(this.currentAddImg);
        },
        formIsValid () {
            return (
              this.currentAddAuthor &&
              this.currentAddDepartment &&
              this.currentAddDescription &&
              this.currentAddMark && this.currentAddName && this.currentAddName && this.currentAddTech && this.currentAddYear
            )
          },
        gitlabAuthFormIsValid() {
            return(this.personalAccessToken)
        },

        loginFormIsValid () {
            return (
                this.authorizeLogin && this.authorizePass
            )
        },
        registrationFormIsValid () {
            return(
                this.userNameReg &&
                this.emailReg &&
                this.passwordReg
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
        makeRequest: async function(url, method, params = {}, headers = {}, data = {}){
            return new Promise(function (resolve, reject)
                {
                    let xhr = new XMLHttpRequest();
                    let path = url;
                    if (params != {}){
                        path += `?${new URLSearchParams(params).toString()}`;
                    }
                    xhr.open(method, path, true);
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) {
                                resolve(JSON.parse(xhr.response));
                            }
                            else{
                                reject({status: this.status,
                                        statusText: xhr.statusText})
                            }
                        }
                    };
                    if (headers != {}){
                        for (let [key, value] of Object.entries(headers)){
                                xhr.setRequestHeader(key, value);
                            }
                    }
                    if (method == 'POST'){
                        xhr.send(JSON.stringify(data));
                    }
                    else {
                        xhr.send();
                    }
                }
            )
        },
        getCSRFToken: function(){
            return Cookies.get('csrftoken');
        },
        getUserProjects: async function(){
            app.userProjects = await this.makeRequest(`https://gitlab.informatics.ru/api/v4/users/${app.userId}/projects`, "GET", {}, {'PRIVATE-TOKEN': this.personalAccessToken}, {});
        },
        getUserInfo: async function(){
            app.userInf = await this.makeRequest(`https://gitlab.informatics.ru/api/v4/users/${app.userId}/`, "GET", {}, {'PRIVATE-TOKEN': this.personalAccessToken}, {});
        },
        sendInf: async function(){
            console.log(await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()}, {'requestType': 'userAuth', 'username': this.userInf.username, 'private_token': sha256(this.personalAccessToken)})).status;
        },
        getId: async function(){
            app.userId = (await this.makeRequest(`https://gitlab.informatics.ru/api/v4/personal_access_tokens`, "GET", {}, {'PRIVATE-TOKEN': this.personalAccessToken}, {}))[0].user_id;
        },

        registryTmp: async function(){
            await this.getId();
            await this.getUserInfo();
            await this.getUserProjects();
            await this.sendInf();
        },
        authCheck: async function(){
            let authCheckResponse = (await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()},
                {'requestType': 'authCheck'}));
                this.isAuthorized = authCheckResponse.authStatus
        },
        auth: async function(){
             this.authResponse = (await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()},
             {'requestType': 'userAuth', 'username': this.authorizeLogin, 'password': sha256(this.authorizePass)}));
             console.log(this.authResponse.responseStatus)
             await this.authCheck();
             this.authorizePass = '';
             if (this.authResponse.responseStatus == 'Successfully authenticated'){
                this.authorizeLogin = '';
                this.currentUser= (JSON.parse(this.authResponse.currentUser))[0];
                console.log(this.currentUser.fields.password);
                this.dialogLog = false;
             }

        },
        registry: async function(){
            this.registryResponse = (await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()},
             {'requestType': 'userRegistry', 'username': this.userNameReg, 'email': this.emailReg, 'firstname':this.firstNameReg,
              'secondname':this.secondNameReg, 'password': sha256(this.passwordReg)}));
            console.log(this.registryResponse.responseStatus);
            this.dialogReg = false;
            this.userNameReg = '';
            this.emailReg = '';
            this.firstNameReg = '';
            this.secondNameReg= '';
            this.passwordReg = '';
        },
        gitlabAuth: async function(){
            this.gitlabAuthResponse = (await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()},
             {'requestType': 'gitlabAuth', 'personalAccessToken': this.personalAccessToken}));
            console.log(this.gitlabAuthResponse.responseStatus)
        },

        unauth: async function(){
             let unauthResponse = (await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()},
             {'requestType': 'userUnAuth'}));
             console.log(unauthResponse.responseStatus)
             this.isAuthorized = false
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
                this.currentId=this.recentProjects[this.carouselIterator].id
                this.currentName=this.recentProjects[this.carouselIterator].name
                this.currentDescription=this.recentProjects[this.carouselIterator].description
                this.currentAuthor=this.recentProjects[this.carouselIterator].author
                this.currentDepartment=this.recentProjects[this.carouselIterator].department
                this.currentMark=this.recentProjects[this.carouselIterator].mark
                this.currentYear=this.recentProjects[this.carouselIterator].year
                this.currentProjectImages=this.recentProjects[this.carouselIterator].images
                this.currentProjectAvatar=this.recentProjects[this.carouselIterator].icon
            } else {
                this.currentId=item.id
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
        update: async function (){
            let a = await this.makeRequest(`${this.baseUrl}api/projects/`, "GET", {'start': this.items.length, 'number': 5, 'year': this.selectedYear,'department': this.selectedDepartment, 'mark': this.selectedMark, 'author': this.selectedAuthor,'name': this.searchText, 'status': 'approved'}, {}, {})
            app.items = app.items.concat(a);
        },
        updateAdminList: async function(){
            app.moderateProjects = this.moderateProjects.concat(await app.makeRequest(`${this.baseUrl}api/projects/`, "GET", {'start': this.moderateProjects.length, 'number': 3, 'status': 'on moderate'}, {}, {}));
        },
        setModeratableState(state){
            this.isCardModeratable = state
        },

        filter: function() {
            this.items = [];
            this.update();
        },
        getFilterParams: async function(){
            let a = await this.makeRequest(`${this.baseUrl}api/filter_params/`, "GET", {}, {}, {})
            app.yearItems = a.years;
            app.departmentItems = a.departments;
            app.authorItems = a.authors;
            app.markItems = a.marks;
        },
        getRecentProjects: async function(){
            let a = await this.makeRequest(`${this.baseUrl}api/recent_projects/`, "GET", {}, {}, {});
            app.recentProjects = a;
            await app.updateCurrentData();
            await this.authCheck();
        },
        sendProjectOnModerate: async function(item){
            await this.makeRequest(`${this.baseUrl}`,
            "POST", {}, {'X-CSRFToken': app.getCSRFToken()}, {
                'requestType': 'elementAdd',
                'currentAddName': this.currentAddName.trim(),
                'currentAddDescription': this.currentAddDescription.trim(),
                'currentAddAuthor': this.currentAddAuthor.trim(),
                'currentAddTech': this.currentAddTech.trim(),
                'currentAddDepartment': this.currentAddDepartment.trim(),
                'currentAddMark': this.currentAddMark.trim(),
                'currentAddYear': this.currentAddYear.trim(),
                'currentAddImages': this.currentProjectImages,
            })
        },
        sendProjectRunConfig: async function(id){
            let a = await this.makeRequest(`${this.baseUrl}`,
            "POST", {}, {'X-CSRFToken': app.getCSRFToken()}, {
                'requestType': 'elementRun',
                'elementId': id,
            });
            if (a.status == 'ok'){
                    window.location.href = `http://cont${a.cont.id}.localhost:1337`;
                  }
            else{
                console.log(a.status)
            }
        },
        changeProjectStatus: async function(id){
            let a = await this.makeRequest(`${this.baseUrl}`,
            "POST", {}, {'X-CSRFToken': app.getCSRFToken()}, {
                'requestType': 'elementChangeStatus',
                'elementId': id,
                'elementNewStatus': this.changedStatus,
            });
        },
    },
  mounted(){
    this.update();
    this.getFilterParams();
    this.getRecentProjects();

  },
})
