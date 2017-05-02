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

    onAddRail: function() {
      //add a new blank rail to the form and invalidate combined dnl
      this.formData.rails.push(blankRail());
      this.formData.combined_dnl = null;
    },

    onAddRoad: function() {
      //add a new blank road to the form and invalidate combined dnl
      this.formData.roads.push(blankRoad());
      this.formData.combined_dnl = null;
    },

    onMoveMarker: function() {
      this.currentMarkerId = '';
    },

    onRemoveRail: function(index) {
      //remove rail from form data and invalidate combined dnl
      this.formData.rails.splice(index, 1);
      this.formData.combined_dnl = null;
    },

    onRemoveRoad: function(index) {
      //remove road from form data and invalidate combined dnl
      this.formData.roads.splice(index, 1);
      this.formData.combined_dnl = null;
    },

    onResetForm: function() {
      this.formData = blankSite();
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
      if (!this.formData.site_name) this.formData.site_name = "NAL";
      this.currentTab = 'form';
    },

    onUpdateForm: function(data) {
      this.formData = data;
    },

    onUpdateRail: function(index, data) {
      //overwrite rail with data from form
      //Vue.set is required to ensure reactivity for this operation
      Vue.set(this.formData.rails, index, data);
      //assume new values invalidate dnl calculation
      this.formData.combined_dnl = null;
    },

    onUpdateRoad: function(index, data) {
      //overwrite road with data from form
      //Vue.set is required to ensure reactivity for this operation
      Vue.set(this.formData.roads, index, data);
      //assume new values invalidate dnl calculation
      this.formData.combined_dnl = null;
    },

    onUpdateSite: function(data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          this.formData[key] = data[key];
        }
      }
    }

  }
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function blankRoad() {
  var date = new Date();
  return {
    name: "Road",
    counted_adt: null,
    counted_adt_year: null,
    adt: 1000,
    adt_year: date.getYear() + 1900 + 10,
    distance: 200,
    stop_sign_distance: null,
    grade: 0.02,
    dnl: null,
    auto: {
      night_fraction: 0.15,
      speed: 55,
    },
    medium_truck: {
      adt_fraction: 0.02,
      night_fraction: 0.15,
      speed: 55
    },
    heavy_truck: {
      adt_fraction: 0.02,
      night_fraction: 0.15,
      speed: 55
    }
  }
}

function blankRail() {
  return {
    name: "New Rail",
    distance: 1000,
    speed: 30,
    diesel: true,
    engines_per_train: 2,
    cars_per_train: 50,
    ato: 0,
    night_fraction: 0.15,
    horns: false,
    bolted_tracks: false,
    dnl: null,
    railroad: "-railroad-",
    branch: "-branch-",
    division: "-division-",
    subdivision: "-subdivision-",
    rr_class: "",
    rrowner_1: "-owner-",
    status: "-status-"
  }
}

function blankSite() {
  var d = new Date();
  return {
    name: 'NAL',
    date: d.toJSON(),
    user_name: "",
    growth_rate: 0.015,
    position: {lat: null, lng: null},
    county: {name: ''},
    combined_dnl: null,
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