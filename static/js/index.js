var app = new Vue( {
  el: '#app',

  data: {
    currentMarkerId: '',
    currentTab: 'map',
    formData: {}
  },

  components: {
    'navbar': NavBar,
    'maptab': MapTab,
    'formtab': FormTab,
    'abouttab': AboutTab
  },

  methods: {
    onSelectMarker: function(id) {
      this.currentMarkerId = id;
    },

    onSelectTab: function(tab) {
      this.currentTab = tab;
    },

    onMoveMarker: function() {
      this.currentMarkerId = '';
    },

    onSendToForm: function(data) {
      this.formData = data;
      this.currentTab = 'form';
    },

    onResetForm: function() {
      this.formData = {
        roads: [],
        rail: [],
        combined_dnl: 0
      }
    }
  }
});







function newGUID() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var getColor = function(dnl) {
  var color = 'green';

  if (dnl > 75) {
    color = 'red';
  } else if (dnl > 70) {
    color = 'orange';
  } else if (dnl > 65) {
    color = 'yellow';
  }

  return color;

}

var getDescription = function(dnl) {
  var desc = 'Acceptable';

  if (dnl > 75) {
    desc = 'Unacceptable';
  } else if (dnl > 65) {
    desc = 'Normally Unacceptable';
  }

  return desc;
}

var spinnerHTML = `
        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
        `