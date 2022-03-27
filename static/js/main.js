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
    filter: function(){
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://127.0.0.1:8000/", true)
        let CSRF_token = document.querySelector('[name=csrfmiddlewaretoken]').value
        xhr.setRequestHeader("X-CSRFToken", CSRF_token);
        let filter_data = {
            year: this.selectedYear,
            department: this.selectedDepartment,
            mark: this.selectedMark,
            name: this.searchText,
            author: this.selectedAuthor,
        }

        xhr.send(JSON.stringify(filter_data))
         xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            console.log('300 bucks')
          }
        };

    },
    update: function (){
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `http://127.0.0.1:8000/api/projects/?start=${this.items.length}&number=2&format=json`, true);
        xhr.send();
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            let response=xhr.response;
            let a = JSON.parse(response);
            app.items = app.items.concat(a);
          }
        };
    },
    getFilterParams: function(){
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `http://127.0.0.1:8000/api/filter_params`, true);
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
    }
  },
  mounted(){
    this.update();
    this.getFilterParams();

  }
})
