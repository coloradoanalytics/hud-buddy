var markers = {};

var MapRoadDisplay = {
  template: `
  <article class="media">
    <div class="media-content">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <strong>{{ road.name }}</strong>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <strong>{{ roadDnl }}</strong>
          </div>
        </div>
      </div>

      <div class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">distance</p>
            <p> {{ road.distance }} feet</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">{{ road.adt_year }} ADT</p>
            <p> {{ futureAdt }}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Heavy Trucks</p>
            <p> {{ heavyTrucks }}</p>
          </div>
        </div>
      </div>
    </div>
  </article>
  `,

  computed: {

    futureAdt: function() {
      return numberWithCommas(Math.round(this.road.adt));
    },

    heavyTrucks: function() {
      return Math.round(this.road.heavy_truck.adt_fraction * 10000)/100 + "%";
    },

    roadDnl: function() {
      if (this.road.dnl) return this.road.dnl.toString() + " dB";
      return "--";
    }
  },

  props: [ 'road' ]
}

var MapRailDisplay = {
  template: `
  <article class="media">
    <div class="media-content">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <strong>{{ rail.name }}</strong>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <strong>{{ railDnl }}</strong>
          </div>
        </div>
      </div>
    </div>
  </article>
  `,

  computed: {
    railDnl: function() {
      if (this.rail.dnl) return this.rail.dnl.toString() + " dB";
      return "--";
    }
  },

  props: [ 'rail' ]
}

var MapAirportDisplay = {
  template: `
  <article class="media">
    <div class="media-content">
        <strong>{{ airport.name }}</strong>

        <div class="level">
          <div class="level-item has-text-centered">
            <div>
            <p class="heading">Type</p>
            <p>{{airport.airport_type}}</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
            <p class="heading">Distance</p>
            <p>{{ distanceInMiles }} miles</p>
            </div>
          </div>
          <div class="level-item has-text-centered">
            <div>
            <p class="heading">Annual Ops</p>
            <p>{{airport.annual_ops}}</p>
            </div>
          </div>
        </div>

    </div>
  </article>
  `,

  computed: {
    distanceInMiles: function() {
      var miles = this.airport.distance / 5280;
      return Math.round(miles * 10) / 10;
    }
  },

  props: [ 'airport' ]
}

//main component for map tab

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
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  <div class="title">{{ dnlUnits }}</div>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <div class="subtitle">{{ dnlCategory }}</div>
                </div>
              </div>
            </div>

            <div class="level" >
              <div class="level-left"></div>
              <div class="level-right">
                <div class="level-item">
                  <a class="button" v-on:click="removeCurrentMarker" >Remove</a>
                </div>
                <div class="level-item">
                  <a class="button is-primary" v-on:click="sendToForm">Send to Form</a>
                </div>
              </div>
            </div>

            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Roads
                </p>
              </header>
              <div class="card-content">
                <map-road-display v-for="road in currentMarker.data.roads" v-bind:road="road" :key="road.street_name"></map-road-display>
              </div>
            </div>

            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Railroads
                </p>
              </header>
              <div class="card-content">
                <map-rail-display v-for="rail in currentMarker.data.rails" v-bind:rail="rail" :key="rail.railroad"></map-rail-display>
              </div>
            </div>

            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Airports
                </p>
              </header>
              <div class="card-content">
                <map-airport-display v-for="airport in currentMarker.data.airports" v-bind:airport="airport" :key="airport.name"></map-airport-display>
              </div>
            </div>  
          </template>

          <template v-else>
            <div class="level">
              <div class="level-left">
                <div class="level-item>">
                  <div class="title">Select Analysis Location</div>
                </div>
              </div>
              <div class="level-right">
              </div>
            </div>
          </template>

          </div>



        </div>
      </div>
    </div>
  `,

  methods: {

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

    'placeMarker': function(marker, lat, lng) {
      marker.labelContent = spinnerHTML;
      marker.label.setContent();
      marker.icon.strokeColor = 'white';
      marker.setShape();
      var url = '/api/sites/?lat='+lat+'&lng='+lng;
      var redrawMarker = this.redrawMarker;
      var self = this;

      fetch(url).then(function(response) {return response.json(); }).then(function(json) {
        markers[marker.id].data = json;
        self.selectMarker(marker);
        self.redrawMarker(marker, json);
      });

    },

    'redrawMarker': function(marker, json) {
      if (json.combined_dnl == null) {
        marker.labelContent = "N/A";
        marker.label.setContent();
      } else {
        var dnl = Number(json.combined_dnl);

        var pinColor = getColor(dnl);

        marker.labelContent = dnl.toString();
        marker.label.setContent();

        marker.icon.strokeColor = pinColor;
        marker.setShape();
      }
    },

    'removeCurrentMarker': function() {
      markers[this.currentMarkerId].marker.setMap(null);
      delete markers[this.currentMarkerId];
      this.$emit('select-marker', '');
    },

    'selectMarker': function(marker) {
      marker.labelAnchor = new google.maps.Point(23,-6);
      marker.labelClass = "labels selected";
      marker.label.draw();
      this.$emit('select-marker', marker.id);
    },

    sendToForm: function() {
      //send a copy of the current marker's data to the form
      this.$emit('send-to-form', JSON.parse(JSON.stringify(markers[this.currentMarkerId].data)));
    }

  },

  mounted: function() {
    this.initMap();
  },

  computed: {
    currentMarker: function() {
      if (this.currentMarkerId) {
        return markers[this.currentMarkerId];
      }

      return {
        marker: {},
        data: blankData()
      };
    },

    dnlUnits: function() {
      if (!this.currentMarker.data.combined_dnl) return "-- dBA";
      return this.currentMarker.data.combined_dnl.toString() + " dBA";
    },

    dnlCategory: function() {
      if (!this.currentMarker.data.combined_dnl) return "Incomplete Data";
      if (this.currentMarker.data.combined_dnl > 75) return "Unacceptable";
      if (this.currentMarker.data.combined_dnl > 65) return "Normally Unacceptable";
      return "Acceptable";
    },

    markerIsSelected: function() {
      return this.currentMarkerId != '';
    }
  },

  props: [ 'current-marker-id' ],

  components: {
    'map-road-display': MapRoadDisplay,
    'map-rail-display': MapRailDisplay,
    'map-airport-display': MapAirportDisplay
  }
};