var FormTab = {

	template: `
		<div class="section">
			<div class="container">
        <div class="columns">

          <div class="column is-two-thirds">
            
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Road
                </p>
              </header>
              <div class="card-content">
                Average Daily Trips
                Percent Medium Trucks
                Percent Heavy Trucks
                Night Fraction Autos/MT
                Night Fraction Heavy Trucks
                Effective Distance
                Distance to Stop Sign
                Gradient

              </div>
            </div>

            <div class="level">
              <div class="level-left"></div>
              <div class="level-right">
                <p class="level-item">
                  <a class="button is-primary">Add Road</a>
                </p>
              </div>
            </div>

            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Rail
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

  props: [ 'form-data' ],

  methods: {

    resetForm: function() {
      this.$emit('reset-form');
    }

  }
}