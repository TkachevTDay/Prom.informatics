var app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data(){
    return {
      dialog: false,
      slider: [
        "red",
        "green",
        "orange",
        "blue",
        "pink",
        "purple",
        "indigo",
        "cyan",
        "deep-purple",
        "light-green",
        "deep-orange",
        "blue-grey"
      ],
      selectedItem: 1,
      carousel: 0,
      selectedMark: '',
      selectedDepartment: '',
      selectedYear: '',
      searchText: '',
      items: [

      ]
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
        xhr.open("GET", `http://127.0.0.1:8000/api/projects/?start=${this.items.length}&number=1&format=json`, true)
        xhr.send()
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            let response=xhr.response
            let a = JSON.parse(response)
            app.items = app.items.concat(a)
          }
        };
    },
  },
  mounted(){
    this.update()
  }
})
