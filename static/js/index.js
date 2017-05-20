//main Vue object and component
//attaches to #app element

var app = new Vue( {
  el: '#app',

  data: {
    currentMarkerId: '',
    currentTab: 'map',
    formData: blankSite(),
  },

  components: {
    'navbar': NavBar,
    'maptab': MapTab,
    'formtab': FormTab,
    'abouttab': AboutTab
  },

  methods: {

    onAddAirport: function() {
      //add a new blank airport to the form and invalidate combined dnl
      this.formData.airports.push(blankAirport());
      this.formData.combined_dnl = null;
    },

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
      //clear marker selection while a marker is being dragged
      this.currentMarkerId = '';
    },

    onRemoveAirport: function(index) {
      //remove rail from form data and invalidate combined dnl
      this.formData.airports.splice(index, 1);
      this.formData.combined_dnl = null;
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
      //clear form by inserting a new, blank site
      this.formData = blankSite();
    },

    onSelectMarker: function(id) {
      //put marker id from event into currentMarkerId
      this.currentMarkerId = id;
    },

    onSelectTab: function(tab) {
      //tab components know whether to display based on the value in this.currentTab
      this.currentTab = tab;
    },

    onSendToForm: function(data) {
      //copy data from current marker to the form and change tabs
      this.formData = data;
      if (!this.formData.name) this.formData.name = "NAL";
      this.currentTab = 'form';
    },

    onUpdateForm: function(data) {
      //overwrite formData with site from update event
      this.formData = data;
    },

    onUpdateAirport: function(index, data) {
      //overwrite airport with data from form
      //Vue.set is required to ensure reactivity for this operation
      Vue.set(this.formData.airports, index, data);
      //assume new values invalidate dnl calculation
      this.formData.combined_dnl = null;
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
      //update site object key by key
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          this.formData[key] = data[key];
        }
      }
    }
  }

});

