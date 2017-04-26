var RoadForm = {

	template: `
		<div class="card">
            
      <header class="card-header">
        <p class="card-header-title">
          {{road.name}}
        </p>
        <a class="card-header-icon" v-on:click="editRoad(index)">
          <span class="icon">
            <i class="fa fa-pencil"></i>
          </span>
        </a>
        <a class="card-header-icon">
          <span class="icon" v-on:click="removeRoad()">
            <i class="fa fa-trash"></i>
          </span>
        </a>
      </header>
      <div class="card-content">
        <table class="table">
          <thead>
            <tr>
              <th>Traffic</th>
              <th style="text-align:center">ADT</th>
              <th style="text-align:center">Percent of ADT</th>
              <th style="text-align:center">Night Fraction</th>
              <th style="text-align:center">Speed (mph)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total</td>
              <td class="has-text-centered">{{ totalAdt }}</td>
              <td colspan="3"></td>
            <tr>
            <tr>
              <td>Autos</td>
              <td class="has-text-centered">{{ autosAdt }}</td>
              <td class="has-text-centered">{{ autosPercent }}%</td>
              <td class="has-text-centered">{{ autosNight }}%</td>
              <td class="has-text-centered">{{ road.speed_autos }}</td>
            </tr>
            <tr>
              <td>Medium Trucks</td>
              <td class="has-text-centered">10,000</td>
              <td class="has-text-centered">10%</td>
              <td class="has-text-centered">15%</td>
              <td class="has-text-centered">55</td>
            </tr>
            <tr>
              <td>Heavy Trucks</td>
              <td class="has-text-centered">10,000</td>
              <td class="has-text-centered">10%</td>
              <td class="has-text-centered">15%</td>
              <td class="has-text-centered">50</td>
            </tr>
          </tbody>
        </table>

        <table class="table">
          <thead>
            <tr>
              <th style="text-align:center">Effective Distance (feet)</th>
              <th style="text-align:center">Grade</th>
              <th style="text-align:center">Distance to Stop Sign (feet)</th>
              <th style="text-align:center">For Year</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="has-text-centered">355</td>
              <td class="has-text-centered">2.0 %</td>
              <td class="has-text-centered">0</td>
              <td class="has-text-centered">2027</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
	`,

	computed: {
		autosAdt: function() {
			if (this.road.adt) {
    		p = 1 - this.road.heavy_trucks - this.road.medium_trucks;
      	p = Math.round(p * this.road.adt);
      	return numberWithCommas(p);
    	}
    	return 0;
    },

    autosPercent: function() {
      p = 1 - this.road.heavy_trucks - this.road.medium_trucks;
      return p * 100;
    },

    autosNight: function() {
      return this.road.night_fraction_autos * 100;
    },

    totalAdt: function() {
      if (this.road.adt) return numberWithCommas(this.road.adt);
      return 0;
    },
	},

	methods: {

    editRoad: function(index) {
      this.$emit('edit-road', index);
    },


    removeRoad: function() {
      console.log('remove-road')
      this.$emit('remove-road', this.index);
    }
	},

	props: [ "index", "road" ]

}