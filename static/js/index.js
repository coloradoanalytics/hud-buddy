var app = new Vue( {
  el: '#app',

  data: {
    currentMarkerId: '',
    currentTab: 'map',
    formData: {},
    roadEditIndex: null
  },

  components: {
    'navbar': NavBar,
    'maptab': MapTab,
    'formtab': FormTab,
    'abouttab': AboutTab
  },

  methods: {
    onAddRoad: function() {
      //add a new blank road to the form and invalidate combined dnl
      this.formData.roads.push(blankRoad());
      this.formData.combined_dnl = null;
    },

    onUpdateRoad: function(index, data) {
      //overwrite road with data from form
      //Vue.set is required to ensure reactivity for this operation
      Vue.set(this.formData.roads, index, data);
    },

    onMoveMarker: function() {
      this.currentMarkerId = '';
    },

    onRemoveRoad: function(index) {
      //remove road from form data and invalidate combined dnl
      this.formData.roads.splice(index, 1);
      this.formData.combined_dnl = null;
    },

    onResetForm: function() {
      this.formData = blankData();
      this.roadEditIndex = null;
    },

    onSelectMarker: function(id) {
      this.currentMarkerId = id;
    },

    onSelectTab: function(tab) {
      this.currentTab = tab;
    },

    onSendToForm: function(data) {
      this.formData = data;
      this.roadEditIndex = null;
      this.currentTab = 'form';
    }

  }
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function blankRoad() {
  var date = new Date();
  return {
    name: "New Road",
    counted_adt: null,
    counted_adt_year: null,
    adt: 1000,
    adt_year: date.getYear() + 1900 + 10,
    night_fraction_autos: 0.15,
    night_fraction_trucks: 0.15,
    distance: 100,
    stop_sign_distance: 0,
    grade: 0.02,
    medium_trucks: 0.02,
    heavy_trucks: 0.02,
    speed_autos: 55,
    speed_trucks: 55,
    dnl: null
  }
}

function blankData() {
  return {
    combined_dnl: null,
    county: {name: ''},
    growth_rate: 0.015,
    name: '',
    position: {latitude: null, longitude: null},
    roads: [],
    rails: [],
    airports: []
  };
}

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

function roundToFive(x) {
  return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}