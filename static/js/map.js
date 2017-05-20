var markers = {};

var MapTab = {

  template: `
    <div class="section">
      <div class="container">
        <div class="columns">

          <div class="column is-two-thirds" >
            <div id="map" class="box" ></div>
          </div>
            
          <div class="column">

          <template v-if="markerIsSelected">

            <map-summary
            v-bind:airports-dnl="airportsDnl"
            v-bind:rails-dnl="railsDnl"
            v-bind:roads-dnl="roadsDnl"
            v-bind:site-dnl="siteDnl"
            @remove-current-marker="onRemoveCurrentMarker"
            @send-to-form="onSendToForm"
            ></map-summary>

            <div v-if="roadsDnl.count" class="card">

              <header class="card-header">
                <p class="card-header-title">
                  Roads
                </p>
                <p class="card-header-icon" >
                  <span class="tag is-medium" v-html="roadsDnl.value"></span>
                </p>
                <p v-if="!roadsDnl.isComplete" class="card-header-icon" title="Value derived from incomplete data">
                  <span class="icon">
                    <i class="fa fa-exclamation-triangle"></i>
                  </span>
                </p>
              </header>

              <div class="card-content">
                <map-road-display v-for="road in currentMarker.data.roads" v-bind:road="road" :key="road.street_name"></map-road-display>
              </div>

            </div>

            <div v-if="railsDnl.count" class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Railroads
                </p>
                <p class="card-header-icon" >
                  <span class="tag is-medium" v-html="railsDnl.value"></span>
                </p>
                <p v-if="!railsDnl.isComplete" class="card-header-icon" title="Value derived from incomplete data">
                  <span class="icon">
                    <i class="fa fa-exclamation-triangle"></i>
                  </span>
                </p>
              </header>

              <div class="card-content">
                <map-rail-display v-for="rail in currentMarker.data.rails" v-bind:rail="rail" :key="rail.railroad"></map-rail-display>
              </div>
            </div>

            <div v-if="airportsDnl.count" class="card">

              <header class="card-header">
                <p class="card-header-title">
                  Airports
                </p>
                <p class="card-header-icon" >
                  <span class="tag is-medium" v-html="airportsDnl.value"></span>
                </p>
                <p v-if="!airportsDnl.isComplete" class="card-header-icon" title="Value derived from incomplete data">
                  <span class="icon">
                    <i class="fa fa-exclamation-triangle"></i>
                  </span>
                </p>
              </header>

              <div class="card-content">
                <map-airport-display v-for="airport in currentMarker.data.airports" v-bind:airport="airport" :key="airport.name"></map-airport-display>
              </div>

            </div>

            <div v-if="!roadsDnl.count" class="card">
              <div class="card-content">No roads in range</div>
            </div>

            <div v-if="!railsDnl.count" class="card">
              <div class="card-content">No railroads in range</div>
            </div>

            <div v-if="!airportsDnl.count" class="card">
              <div class="card-content">No airports in range</div>
            </div>
          </template>

          <template v-else>
            <div class="title">Select Analysis Location</div>
            <p>Click the map to place a marker. HUD Buddy will search public records for transportation noise sources.</p>
            <br>
            <p>
              <span class="icon"><i class="fa fa-car" aria-hidden="true"></i></span>
              Highways within 1500 feet
            </p>
            <p>
              <span class="icon"><i class="fa fa-train" aria-hidden="true"></i></span>
              Railroads within 4500 feet
            </p>
            <p>
              <span class="icon"><i class="fa fa-plane" aria-hidden="true"></i></span>
              Airports within 15 miles
            </p>
            <br>
            <p>
              A DNL calculation will be performed using available data. Click Send to Form to edit or add additional data.
            </p>
            <br>
            <p>
              Moving a marker will start a new public data query and recalculate the noise level for the new location.
            </p>
          </template>

          </div>

        </div>
      </div>
    </div>
  `,

  methods: {
    'combineSources': function(sources) {
      var nrg = 0;
      var d = {value: 0, isComplete: true, count: sources.length};

      for (var i=0; i<sources.length; i++) {
        if (sources[i].dnl) {
          nrg += Math.pow(10, sources[i].dnl / 10);
        } else {
          d.isComplete = false;
        }
      }

      if (nrg > 0) d.value = Math.round(10 * Math.log10(nrg) * 10) / 10;
      return d;
    },

    'clearSelectedMarker': function() {
      if (this.currentMarkerId) {
        this.currentMarker.marker.labelAnchor = new google.maps.Point(18, -6);
        this.currentMarker.marker.labelClass = "labels";
        this.currentMarker.marker.label.draw();
      }
    },

    'createMarker': function(event, map) {
      this.clearSelectedMarker();
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();

      var id = newGUID();
        
      var marker = new MarkerWithLabel({
        id: id,
        position: {lat, lng},
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: 'black',
          fillOpacity: 1.0,
          scale: 10,
          strokeWeight: 12
        },
        draggable: true,
        labelAnchor: new google.maps.Point(18,-6),
        labelStyle: {opacity: 1.0},
        labelClass: "labels"
      });

      self = this;

      marker.addListener('drag', function(event) {
        self.clearSelectedMarker();
        self.$emit('move-marker');
      });
      marker.addListener('dragend', function(event){
        self.moveMarker(event, this);
      });
      marker.addListener('click', function(event){
        self.clearSelectedMarker();
        self.selectMarker(this);
      });

      markers[id] = {marker: marker, data: {combined_dnl: 0, roads: []}};

      this.placeMarker(marker, lat, lng);
    },

    'initMap': function() {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.797, lng: -104.958},
        zoom: 12
      });

      var self = this;
      this.map.addListener('click', function(event) {
        self.createMarker(event, this);
      });
    },

    'moveMarker': function(event, marker) {
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();
      this.placeMarker(marker, lat, lng);

    },

    'onRemoveCurrentMarker': function() {
      markers[this.currentMarkerId].marker.setMap(null);
      delete markers[this.currentMarkerId];
      this.$emit('select-marker', '');
    },

    'onSendToForm': function() {
      this.$emit('send-to-form', JSON.parse(JSON.stringify(markers[this.currentMarkerId].data)));
    },

    'placeMarker': function(marker, lat, lng) {
      marker.labelContent = spinnerHTML;
      marker.label.setContent();
      marker.icon.strokeColor = 'white';
      marker.setShape();
      var url = '/api/sites/?lat='+lat+'&lng='+lng;
      var redrawMarker = this.redrawMarker;
      var self = this;

      axios.get(url).then(
        function(response) {return response.data; }).then(function(json) {
        markers[marker.id].data = json;
        self.selectMarker(marker);
        self.redrawMarker(marker, json);
      });

    },

    'redrawMarker': function(marker, json) {
      var airportsDnl = this.combineSources(json.airports);
      var railsDnl = this.combineSources(json.rails);
      var roadsDnl = this.combineSources(json.roads);

      var nrg = 0;
      if (airportsDnl.value) nrg += Math.pow(10, airportsDnl.value / 10);
      if (railsDnl.value) nrg += Math.pow(10, railsDnl.value / 10);
      if (roadsDnl.value) nrg += Math.pow(10, roadsDnl.value / 10);

      if (nrg == 0) {
        marker.labelContent = "--";
        marker.label.setContent();
      } else {
        var dnl = Math.round(10 * Math.log10(nrg) * 10) / 10;
        var isComplete = airportsDnl.isComplete && railsDnl.isComplete && roadsDnl.isComplete;

        var pinColor = getColor(dnl);

        marker.labelContent = dnl.toString();
        if (!isComplete) marker.labelContent += "*";
        marker.label.setContent();

        marker.icon.strokeColor = pinColor;
        marker.setShape();
      }
    },

    'selectMarker': function(marker) {
      marker.labelAnchor = new google.maps.Point(23,-6);
      marker.labelClass = "labels selected";
      marker.label.draw();
      this.$emit('select-marker', marker.id);
    },

  },

  computed: {

    airportsDnl: function() {
      return this.combineSources(this.currentMarker.data.airports);
    },

    currentMarker: function() {
      if (this.currentMarkerId) {
        return markers[this.currentMarkerId];
      }

      return {
        marker: {},
        data: blankData()
      };
    },

    markerIsSelected: function() {
      return this.currentMarkerId != '';
    },

    railsDnl: function() {
      return this.combineSources(this.currentMarker.data.rails);
    },

    roadsDnl: function() {
      return this.combineSources(this.currentMarker.data.roads);
    },

    siteDnl: function() {
      var nrg = 0;

      if (this.airportsDnl.value) nrg += Math.pow(10, this.airportsDnl.value / 10);
      if (this.railsDnl.value) nrg += Math.pow(10, this.railsDnl.value / 10);
      if (this.roadsDnl.value) nrg += Math.pow(10, this.roadsDnl.value / 10);

      if (nrg == 0) return {value: "--", isComplete: true};

      var value = Math.round(10 * Math.log10(nrg) * 10) / 10;
      return {value: value, isComplete: this.airportsDnl.isComplete && this.railsDnl.isComplete && this.roadsDnl.isComplete};
    }
  },

  mounted: function() {
    this.initMap();
  },

  props: [ 'current-marker-id' ],

  components: {
    'map-road-display': MapRoadDisplay,
    'map-rail-display': MapRailDisplay,
    'map-airport-display': MapAirportDisplay,
    'map-summary': MapSummary
  }
};