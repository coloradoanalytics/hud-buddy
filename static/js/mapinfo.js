//Vue component and sub components that display info for selected marker on the map

var MapSummary ={
	template: `
		<div class="card">

      <div class="card-content has-text-centered">

        <div>
          <div>
            <span class="title">DNL {{ siteDnl.value }}</span>
            <span v-if="!siteDnl.isComplete">
              <i class="fa fa-exclamation-triangle" title="Value derived from incomplete data"></i>
            </span>
          </div>
          <div class="subtitle">{{ dnlCategory }}</div>
        </div>

      </div>

      <footer class="card-footer">
        <a class="card-footer-item" v-on:click="removeCurrentMarker">Remove</a>
        <a class="card-footer-item" v-on:click="sendToForm">Send to Form</a>
      </footer>
        
		</div>
	`,

  props: ['airports-dnl', 'rails-dnl', 'roads-dnl', 'site-dnl'],

  computed: {

    dnlCategory: function() {
    	//returns string indicating the HUD category determined by the site DNL
      if (this.siteDnl.value > 75) return "Unacceptable";
      if (this.siteDnl.value > 65) return "Normally Unacceptable";
      if (this.siteDnl.value === "--") return "No noise sources in range";
      return "Acceptable";
    },

  },

  methods: {

    'removeCurrentMarker': function() {
      this.$emit('remove-current-marker');
    },

    sendToForm: function() {
      //initiates sending the data from the currently selected marker to the form tab
      this.$emit('send-to-form');
    }
  }
}

//Vue subcomponent to display road details on the map view
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

//Vue subcomponent to display rail details on the map tab
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

//Vue sub component to display airport details on the map tab
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