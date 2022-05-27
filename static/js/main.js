var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    vuetify: new Vuetify(),
    data(){
        return {
            notificationsAmount: 0,
            notificationsList: [],
            isAdministrator: false,
            isAuthorized: 0,
            authError: false,
            registryError: false,
            personalAccessToken: '',
            personalAccessTokenInput: '',
            userId: 0,
            tokenError: false,
            declineAnswer: '',
            isGitlabConnected: 0,
            authorizeLogin: '',
            authorizePass: '',
            dialog: false,
            dialogAdd: false,
            dialogReg: false,
            dialogAdm: false,
            dialogLog: false,
            dialogDeclineAnswer: false,
            dialogContRunNotify: false,
            dialogNotifications: false,
            addMenu: false,
            dialogGitlabAuth: false,
            userProjects: [],
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
            groups: ['s101', 's102', 's103', 's104', 's105', 's106'],
            departments: ['Физтехпарк', 'Профсоюзная', 'Проспект Мира', 'ВШЭ', 'Яндекс', 'Мытищи', 'Королёв', 'Пушкино', 'Щёлково', 'Онлайн', 'Виртуальный класс'],
            items: [],
            markItems: [],
            departmentItems: [],
            authorItems: [],
            yearItems: [],
            recentProjects: [],
            baseUrl: 'http://prftest.xyz/',
            carouselIterator: 0,
            images: [],
            filterShow: false,
            currentProjectImages: [],
            currentTechStack: '',
            currentAddTechStack: '',
            currentMediaStatus: '',
            currentAddImgs: [],
            files: [],
            currentProjectAvatar: '',
            moderateProjects: [],
            profileNotifications: '',
            changedStatus: '',
            changedDockerStatus: 'declined',
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
            currentUserGroup: '',
            currentUrl: '',
            result: [],
            techStack: ['Django-project', 'Pygame-project', 'Other'],
            rules: {
              value: [val => (val || '').length > 0 || 'Это поле необходимо заполнить!'],
               emailRules: [
                            v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Введите корректный e-mail'
                            ],
               authorizeHint: [v => (this.authResponse.responseStatus != 'Authentication failed (Incorrect input values)') || 'Проверьте правильность заполненных данных'],
               fileInputSize:[
                    files => (files.length <= 5 && this.files.length != 0 && files.map(file => file.size).reduce((previous, next) => previous + next) <= 5242880) || 'Размер файлов не должен превышать 5 МБ. Допустимое количество файлов от 1 до 5 шт.'
               ],

            },
        };
    },
    computed: {
        checkURL () {
                const youtubeEmbedTemplate = 'https://www.youtube.com/embed/'
              const url = this.currentAddImg.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)
              console.log("url", url)
              const YId = undefined !== url[2] ? url[2].split(/[^0-9a-z_/\\-]/i)[0] : url[0]
              console.log("YId", YId)
              if (YId === url[0]) {
                return false
              } else {
                return true
              }
        },
        formIsValid () {
            return (
              this.currentAddAuthor &&
              this.currentAddDepartment &&
              this.currentAddDescription &&
              this.currentAddMark && this.currentAddName && this.currentAddTechStack && this.currentAddYear && (this.files.length <= 5 && this.files.length != 0 && this.files.map(file => file.size).reduce((previous, next) => previous + next) <= 5242880)
            )
          },
        gitlabAuthFormIsValid() {
            return(this.personalAccessTokenInput)
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

        redirectToProjectRepo: async function(){
            window.location.href=this.currentUrl;
        },

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
                        let a = JSON.stringify(data)
                        console.log(a)
                        xhr.send(a);
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
        getUserGroup: async function(){
            let visibleGroups = await this.makeRequest(`https://gitlab.informatics.ru/api/v4/groups`, "GET", {}, {'PRIVATE-TOKEN': this.personalAccessToken}, {});
            app.currentUserGroup = visibleGroups.filter(d => d.visibility==='internal')
            console.log(app.currentUserGroup)
        },

        getUserProjects: async function(){
            if (this.userProjects.length == 0){
                for (i of app.currentUserGroup){
                    app.userProjects = (await this.makeRequest(`https://gitlab.informatics.ru/api/v4/groups/${i.id}/projects`, "GET", {}, {'PRIVATE-TOKEN': this.personalAccessToken}, {}));
                }
            }
        },
        getUserInfo: async function(){
            app.userInf = await this.makeRequest(`https://gitlab.informatics.ru/api/v4/users/${app.userId}/`, "GET", {}, {'PRIVATE-TOKEN': this.personalAccessToken}, {});
        },
        sendInf: async function(){
            console.log(await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()}, {'requestType': 'userAuth', 'username': this.userInf.username, 'private_token': sha256(this.personalAccessToken)})).status;
        },
        getId: async function(){
            console.log(this.personalAccessToken)
            try{
                let response = (await this.makeRequest(`https://gitlab.informatics.ru/api/v4/personal_access_tokens`, "GET", {}, {'PRIVATE-TOKEN': this.personalAccessToken}, {}));
                app.userId = response[0].user_id;
                this.tokenError = false;
            } catch(err) {
                this.tokenError = true;
            }
        },
        projectsLoad: async function(){
            await this.getId();
            if(!this.tokenError){
                await this.getUserGroup();
                await this.getUserProjects();
            }
        },
        authCheck: async function(){
            let authCheckResponse = (await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()},
                {'requestType': 'authCheck'}));
            this.isAuthorized = authCheckResponse.authStatus
            this.isGitlabConnected = authCheckResponse.gitlabStatus
            if(this.isAuthorized == 1){
                this.currentUser= (JSON.parse(authCheckResponse.currentUser))[0];
                if(this.isGitlabConnected == 1){
                    this.personalAccessToken = authCheckResponse.privateAccessToken
                }
            } else {
            this.isAdministrator = false

            }
        },
        auth: async function(){
             this.tokenError = false
             this.authResponse = (await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()},
             {'requestType': 'userAuth', 'username': this.authorizeLogin, 'password': sha256(this.authorizePass)}));
             console.log(this.authResponse.responseStatus)


             this.authorizePass = '';
             if (this.authResponse.responseStatus == 'Successfully authenticated'){
                this.authorizeLogin = '';
                this.dialogLog = false;
                this.authError = false;
             }
             else {
                this.authError = true;
             }
             await this.authCheck();
             await this.notificationsCheck();
             await this.verifyAdministrator();
        },
        registry: async function(){
            this.registryResponse = (await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()},
             {'requestType': 'userRegistry', 'username': this.userNameReg, 'email': this.emailReg, 'firstname':this.firstNameReg,
              'secondname':this.secondNameReg, 'password': sha256(this.passwordReg)}));
            console.log(this.registryResponse.responseStatus);
            if (this.registryResponse.responseStatus == "Successfully saved"){
                this.dialogReg = false;
                this.userNameReg = '';
                this.emailReg = '';
                this.firstNameReg = '';
                this.secondNameReg= '';
                this.passwordReg = '';
                this.registryError = false
            } else {
                this.passwordReg = '';
                this.registryError = true
            }
        },
        gitlabAuth: async function(){


            this.gitlabAuthResponse = (await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()},
             {'requestType': 'gitlabAuth', 'personalAccessToken': this.personalAccessTokenInput}));
            console.log(this.gitlabAuthResponse.responseStatus)

            this.authCheck();
            this.personalAccessTokenInput = ''
            this.dialogGitlabAuth = false
        },

        unauth: async function(){
             let unauthResponse = (await this.makeRequest(`${this.baseUrl}`, "POST", {}, {'X-CSRFToken': app.getCSRFToken()},
             {'requestType': 'userUnAuth'}));
             console.log(unauthResponse.responseStatus)
             this.isAuthorized = false
             this.isAdministrator = false
             this.personalAccessToken = ''
             await this.authCheck();


        },

        showDialog: function(){
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
                const youtubeEmbedTemplate = 'https://www.youtube.com/embed/'
          const url = this.currentAddImg.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)
          console.log("url", url)
          const YId = undefined !== url[2] ? url[2].split(/[^0-9a-z_/\\-]/i)[0] : url[0]
          console.log("YId", YId)
          const topOfQueue = youtubeEmbedTemplate.concat(YId)
          console.log("topOfQueue", topOfQueue)

          this.currentProjectImages.push({'type': 'video', 'src':topOfQueue});
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
                this.currentTechStack=this.recentProjects[this.carouselIterator].tech_stack
                this.currentUrl=this.recentProjects[this.carouselIterator].path_link
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
                this.currentTechStack=item.tech_stack
                this.currentUrl=item.path_link
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
                this.currentAddTechStack=this.userProjects[index].tech_stack
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
        filter: async function() {
            let a = await this.makeRequest(`${this.baseUrl}api/projects/`, "GET", {'start': 0, 'number': 5, 'year': this.selectedYear,'department': this.selectedDepartment, 'mark': this.selectedMark, 'author': this.selectedAuthor,'name': this.searchText, 'status': 'approved'}, {}, {})
            app.items = a
        },
        getFilterParams: async function(){
            let a = await this.makeRequest(`${this.baseUrl}api/filter_params/`, "GET", {}, {}, {})
            app.yearItems = ['',].concat(a.years);
            app.departmentItems = ['',].concat(a.departments);
            app.authorItems = ['',].concat(a.authors);
            app.markItems = ['',].concat(a.marks);
        },
        getRecentProjects: async function(){
            let a = await this.makeRequest(`${this.baseUrl}api/recent_projects/`, "GET", {}, {}, {});
            app.recentProjects = a;
            await app.updateCurrentData();
            await this.authCheck();
            await this.notificationsCheck();
            await this.verifyAdministrator();
        },
        readFile: async function(file){
            return new Promise(function(resolve, reject){
                    var fileReader = new FileReader();
                    console.log(file)
                    fileReader.onload = function (evt) {
                        if(evt.target.error){
                            reject(Error(evt.target.error))
                        }
                        let a = evt.target.result
                        app.result.push(a)
                        resolve(a);
                    };
                    fileReader.readAsDataURL(file)
                }
            )
        },
        // Отправка проекта
        sendProjectOnModerate: async function(item){

            for (i of this.files){
                console.log('resolved by', await this.readFile(i))
            }
            await this.makeRequest(`${this.baseUrl}`,
            "POST", {}, {'X-CSRFToken': app.getCSRFToken()}, {
                'requestType': 'elementAdd',
                'currentAddName': this.currentAddName.trim(),
                'currentAddDescription': this.currentAddDescription.trim(),
                'currentAddAuthor': this.currentAddAuthor.trim(),
                'currentAddDepartment': this.currentAddDepartment.trim(),
                'currentAddMark': this.currentAddMark.trim(),
                'currentAddYear': this.currentAddYear.trim(),
                'currentAddImages': this.currentProjectImages,
                'currentAddPathLink': this.currentAddPathLink,
                'currentTechStack':this.currentAddTechStack,
                'currentFiles': this.result,
            })
        },
        // Отправка данных о запуске проекта
        sendProjectRunConfig: async function(id){

            this.dialogContRunNotify = true
            let a = await this.makeRequest(`${this.baseUrl}`,
            "POST", {}, {'X-CSRFToken': app.getCSRFToken()}, {
                'requestType': 'elementRun',
                'elementId': id,
            });
            this.dialogContRunNotify = false
            if (a.status == 'ok' || a.status == 'Container with this name already exists'){
                    window.location.href = `http://cont${a.cont.id}.prftest.xyz`;
                  }
            else{
                console.log(a.status)
            }
        },
        // Модерация
        changeProjectStatus: async function(){
            let a = await this.makeRequest(`${this.baseUrl}`,
            "POST", {}, {'X-CSRFToken': app.getCSRFToken()}, {
                'requestType': 'elementChangeStatus',
                'personalAccessToken': this.personalAccessToken,
                'elementId': this.currentId,
                'elementNewStatus': this.changedStatus,
                'elementNewDockerStatus': this.changedDockerStatus,
                'elementAnswer': this.declineAnswer,
            });
            this.changedDockerStatus = 'declined'
            await this.updateAdminList();
            await this.update();
            await this.getRecentProjects();
            await this.notificationsCheck();

        },
        notificationsCheck: async function(){
            let a = await this.makeRequest(`${this.baseUrl}`,
            "POST", {}, {'X-CSRFToken': Cookies.get('csrftoken')}, {
                'requestType': 'elementCheckNotifications',
            });
            this.notificationsList = (JSON.parse(a.responseStatus))
            this.notificationsAmount = a.len
        },
        makeRead: async function(){
            let a = await this.makeRequest(`${this.baseUrl}`,
            "POST", {}, {'X-CSRFToken': Cookies.get('csrftoken')}, {
                'requestType': 'elementMakeRead',
                'notifications': this.notificationsList,
            });
            this.notificationsCheck();
        },
        emergency: async function(){
            let a = await this.makeRequest(`${this.baseUrl}`,
            "POST", {}, {'X-CSRFToken': Cookies.get('csrftoken')}, {
                'requestType': 'emergency',
            });
        },
        verifyAdministrator: async function(){
            let a = await this.makeRequest(`${this.baseUrl}`,
            "POST", {}, {'X-CSRFToken': Cookies.get('csrftoken')}, {
                'requestType': 'adminVerify',
            });
            this.isAdministrator = a.status;
        },
    },
  mounted(){
    this.update();
    this.getFilterParams();
    this.getRecentProjects();
  },
})
