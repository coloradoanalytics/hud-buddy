var FormTab = {

	template: `
		<div class="section">
			<div class="container">
        <div class="columns">

          <div class="column is-two-thirds">
            <div class="title">Roads</div>

            <road-form v-for="(road, index) in formData.roads"
              :key="roadKey(index)"
              :index="index"
              :road="road"
              @remove-road="onRemoveRoad"
              ></road-form>

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

    onRemoveRoad: function(index) {
      this.$emit('remove-road', index);
    },

    roadKey: function(index) {
      return "road-" + index.toString();
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
  },

  components: {
    'road-form': RoadForm
  }
}