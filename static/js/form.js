var FormTab = {

	template: `
		<div class="section">
			<div class="container">
        <div class="columns">

          <div class="column is-two-thirds">
            <div class="title">Roads</div>

            <div class="card" v-for="(road, index) in formData.roads" :key="roadKey(index)">
            
              <template v-if="roadEditIndex == index">
                <form v-on:submit="submitRoadForm">
                  <div class="field is-grouped">
                    <p class="control">
                      <button class="button is-primary">Submit</button>
                    </p>
                    <p class="control">
                      <button class="button is-link">Cancel</button>
                    </p>
                  </div>
                </form>
              </template>

              <template v-else>
              <header class="card-header">
                <p class="card-header-title">
                  {{road.street_name}}
                </p>
                <a class="card-header-icon" v-on:click="editRoad(index)">
                  <span class="icon">
                    <i class="fa fa-pencil"></i>
                  </span>
                </a>
                <a class="card-header-icon">
                  <span class="icon" v-on:click="removeRoad(index)">
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
                      <td class="has-text-centered">100,000</td>
                      <td colspan="3"></td>
                    <tr>
                    <tr>
                      <td>Autos</td>
                      <td class="has-text-centered">90,000</td>
                      <td class="has-text-centered">90%</td>
                      <td class="has-text-centered">15%</td>
                      <td class="has-text-centered">55</td>
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
              </template>
            </div>

            <div class="level">
              <div class="level-left"></div>
              <div class="level-right">
                <p class="level-item">
                  <a class="button is-primary" v-on:click="addRoad">Add Road</a>
                </p>
              </div>
            </div>

            <div class="title">Rail</div>
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Name
                </p>
              </header>
              <div class="card-content">
                Electric or Diesel
                Distance
                Speed
                Engines per Train
                Cars per Train
                Average Daily Operations
                Night Fraction
                Horns
                Bolted/Welded Tracks
              </div>
            </div> 

            <div class="level">
              <div class="level-left"></div>
              <div class="level-right">
                <p class="level-item">
                  <a class="button is-primary">Add Rail</a>
                </p>
              </div>
            </div>

          </div>

          <div class="column">
            <div class="title">Summary</div>
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Site
                </p>
              </header>
              <div class="card-content">
                Name or ID
                Date
                User's Name
                Notes
                <p> {{formData}} </p>
              </div>
              <footer class="card-footer">
                <a class="card-footer-item" v-on:click="resetForm">Reset</a>
                <a class="card-footer-item">Generate Report</a>
                <a class="card-footer-item is-primary" >Calculate</a>
              </footer>
            </div>

          </div>

		    </div>
			</div>
		</div>
	`,

  props: [
    'form-data',
    'road-edit-index'
    ],

  computed: {

  },

  methods: {
    addRoad: function() {
      this.$emit('add-road');
    },

    editRoad: function(index) {
      this.$emit('edit-road', index);
    },

    percentAutos: function(road) {
      pa = 1 - road.truck_percentage;
      return (Math.round(pa * 100)).toFixed(2);
    },

    percentMediumTrucks: function(road) {
      return 2;
    },

    percentHeavyTrucks: function(road) {
      return (Math.round(road.truck_percentage * 100)).toFixed(2);
    },

    roadKey: function(index) {
      return "road-" + index.toString();
    },

    removeRoad: function(index) {
      console.log('remove-road')
      this.$emit('remove-road', index);
    },

    resetForm: function() {
      this.$emit('reset-form');
    },

    submitRoadForm: function(event) {
      event.preventDefault();
    }

  },

  mounted: function() {
    this.resetForm();
  }
}