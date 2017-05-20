var FormTab = {

	template: `
		<div class="section">
			<div class="container">
        <div class="columns">

          <div class="column is-two-thirds">
            <div class="title">Roads</div>

            <road-form v-for="(road, index) in formData.roads"
              v-bind:key="roadKey(index)"
              v-bind:index="index"
              v-bind:road="road"
              v-bind:growth-rate="growthRate"
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

            <rail-form v-for="(rail, index) in formData.rails"
              v-bind:key="railKey(index)"
              v-bind:index="index"
              v-bind:rail="rail"
              @remove-rail="onRemoveRail"
              @update-rail="onUpdateRail"
            ></rail-form>

            <div class="level">
              <div class="level-left"></div>
              <div class="level-right">
                <p class="level-item">
                  <a class="button is-primary" v-on:click="addRail">Add Rail</a>
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
              @get-report="onGetReport"
            ></site-form>
            
            <br><br>
            
            <div class="title">Airports</div>
            <airport-form v-for="(airport, index) in formData.airports"
              v-bind:key="airportKey(index)"
              v-bind:airport="airport"
              v-bind:index="index"
              @remove-airport="onRemoveAirport"
              @update-airport="onUpdateAirport"
            ></airport-form>

            <div class="level">
              <div class="level-left"></div>
              <div class="level-right">
                <p class="level-item">
                  <a class="button is-primary" v-on:click="addAirport">Add Airport</a>
                </p>
              </div>
            </div>

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
    addAirport: function() {
      this.$emit('add-airport');
    },
    
    addRail: function() {
      this.$emit('add-rail');
    },

    addRoad: function() {
      this.$emit('add-road');
    },

    airportKey: function(index) {
      return "airport-" + index.toString();
    },

    onGetCalculation: function() {
      var self = this;
      axios.post('/api/sites/', self.formData)
        .then(function(response) {
          return response.data;
        })
        .then(function(json) {
          self.$emit('update-form', json);
        });
    },

    onGetReport: function() {
      var self = this;
      var form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', '/api/reports/');
      form.setAttribute('target', '_blank');
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute('type', 'hidden');
      hiddenField.setAttribute('name', 'site_json');
      hiddenField.setAttribute('value', JSON.stringify(this.formData));
      form.appendChild(hiddenField);
      document.body.appendChild(form);
      form.submit();
    },

    onUpdateAirport: function(index, data) {
      //relay update-airport event and data
      this.$emit('update-airport', index, data);

    },

    onUpdateRail: function(index, data) {
      //relay update-rail event and data
      this.$emit('update-rail', index, data);
    },

    onUpdateRoad: function(index, data) {
      //relay update-road event and data
      this.$emit('update-road', index, data);
    },

    onUpdateSite: function(data) {
      //relay update-site event and data
      this.$emit('update-site', data);
    },

    onRemoveAirport: function(index) {
      //relay remove-airport event
      this.$emit('remove-airport', index);
    },

    onRemoveRail: function(index) {
      //relay remove-rail event
      this.$emit('remove-rail', index);
    },

    onRemoveRoad: function(index) {
      //relay remove-road event
      this.$emit('remove-road', index);
    },

    onResetForm: function() {
      //relay reset-form event
      this.$emit('reset-form');
    },

    railKey: function(index) {
      //create a key for use by Vue
      return "rail-" + index.toString();
    },

    roadKey: function(index) {
      //create a key for use by Vue
      return "road-" + index.toString();
    }

  },

  mounted: function() {
    //this.onResetForm();
  },

  components: {
    'rail-form': RailForm,
    'road-form': RoadForm,
    'site-form': SiteForm,
    'airport-form': AirportForm
  }
}