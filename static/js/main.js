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
        { icon: 'mdi-clock', name: 'zxc', department: 'zxc', author: 'zxc', year: 'zxc'},
        { icon: 'mdi-clock', name: 'zxc', department: 'zxc', author: 'zxc', year: 'zxc'},
        { icon: 'mdi-clock', name: 'zxc', department: 'zxc', author: 'zxc', year: 'zxc'},
        { icon: 'mdi-clock', name: 'zxc', department: 'zxc', author: 'zxc', year: 'zxc'},
        { icon: 'mdi-clock', name: 'zxc', department: 'zxc', author: 'zxc', year: 'zxc'},
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
        this.items.push(
            { icon: 'mdi-clock', name: 'zxc', department: 'zxc', author: 'zxc', year: 'zxc'},
            { icon: 'mdi-clock', name: 'zxc', department: 'zxc', author: 'zxc', year: 'zxc'},
            { icon: 'mdi-clock', name: 'zxc', department: 'zxc', author: 'zxc', year: 'zxc'},
            { icon: 'mdi-clock', name: 'zxc', department: 'zxc', author: 'zxc', year: 'zxc'},
            { icon: 'mdi-clock', name: 'zxc', department: 'zxc', author: 'zxc', year: 'zxc'}
        );
    },
    print: function(){
        alert(this.items);
    },

  }
})
