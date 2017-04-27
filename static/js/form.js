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
              :growth-rate="growthRate"
              @remove-road="onRemoveRoad"
              @update-road="onUpdateRoad"
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

            <site-form
              :form-data="formData"
              @reset-form="onResetForm"
              @update-site="onUpdateSite"
              @get-calculation="onGetCalculation"
            ></site-form>

          </div>

		    </div>
			</div>
		</div>
	`,

  props: [
    'form-data'
    ],

  computed: {
    growthRate: function() {
      return this.formData.growth_rate;
    }
  },

  methods: {
    addRoad: function() {
      this.$emit('add-road');
    },

    onGetCalculation: function() {
      fetch('/api/sites/',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify(this.formData)
        })
        .then(function(response) {
          return response.json(); 
        })
        .then(function(json) {
          this.$emit('update-form', json);
        });
    },

    onUpdateRoad: function(index, data) {
      //relay update-road event and data
      this.$emit('update-road', index, data);
    },

    onUpdateSite: function(data) {
      this.$emit('update-site', data);
    },

    onRemoveRoad: function(index) {
      //relay remove-road event
      this.$emit('remove-road', index);
    },

    onResetForm: function() {
      //relay reset-form event
      this.$emit('reset-form');
    },

    roadKey: function(index) {
      //create a key for use by Vue
      return "road-" + index.toString();
    },

    submitRoadForm: function(event) {
      event.preventDefault();
    }

  },

  mounted: function() {
    this.onResetForm();
  },

  components: {
    'road-form': RoadForm,
    'site-form': SiteForm
  }
}