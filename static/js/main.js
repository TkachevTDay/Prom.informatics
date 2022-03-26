




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
    update: function (){
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://127.0.0.1:8000/api/projects/?start=0&number=1&format=json", true)
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
  beforeMount(){
    this.update()
  }
})
