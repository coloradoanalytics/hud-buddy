var AirportCard = {
	template: `
		<div class="card">

      <header class="card-header">
        <p class="card-header-title">
          {{airport.name}}
        </p>
        <a class="card-header-icon" >
          <span class="tag is-medium" v-html="airportDnl"></span>
        </a>
        <a class="card-header-icon" v-on:click="editAirport()">
          <span class="icon">
            <i class="fa fa-pencil"></i>
          </span>
        </a>
        <a class="card-header-icon">
          <span class="icon" v-on:click="removeAirport()">
            <i class="fa fa-trash"></i>
          </span>
        </a>
      </header>

      <div class="card-content">

      	<table class="table">
          <thead>
            <tr>
              <th style="text-align:center">Type</th>
              <th style="text-align:center">Distance (miles)</th>
              <th style="text-align:center">Annual Ops</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="has-text-centered">{{ airport.airport_type }}</td>
              <td class="has-text-centered">{{ distanceInMiles }}</td>
              <td class="has-text-centered">{{ airport.annual_ops }}</td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
	`,

	computed: {
    airportDnl: function() {
      if (this.airport.dnl) return this.airport.dnl.toString() + " dB";
      return "--";
    },

    distanceInMiles: function() {
      var miles = this.airport.distance / 5280;
      return Math.round(miles * 10) / 10;
    }
	},

	methods: {

    editAirport: function() {
      this.$emit('edit-airport');
    },

    removeAirport: function() {
      this.$emit('remove-airport');
    }
	},

	props: [ "airport" ]

}