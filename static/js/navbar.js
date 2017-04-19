var NavBar = {
  template: `
      <nav class="nav has-shadow" id="top">
        <div class="container">
          <div class="nav-left">
            <a class="nav-item">
              <img src="static/images/hammeronwhite100.png">
            </a>
            <a v-bind:class="tabClass('map')" v-on:click="selectTab('map')">
              Map
            </a>
            <a v-bind:class="tabClass('form')" v-on:click="selectTab('form')">
              Form
            </a>
            <a v-bind:class="tabClass('about')" v-on:click="selectTab('about')">
              About
            </a>
          </div>
          <div class="nav-right">
            <span class="nav-item">
              <a class="button">Sign in</a>
            </span>
          </div>
        </div>
      </nav>
  `,

  methods: {
    selectTab: function(tab) {
      this.$emit('select-tab', tab);
    },

    tabClass: function(tab) {
      var tc = "nav-item is-tab";
      if (tab == this.currentTab) tc += " is-active";
      return tc;
    }
  },

  props: [ 'current-tab' ],

}