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
    
    addRail: function() {
      this.$emit('add-rail')
    },

    addRoad: function() {
      this.$emit('add-road');
    },

    onGetCalculation: function() {
      var self = this;
      console.log(JSON.stringify(self.formData))
      fetch('/api/sites/',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify(self.formData)
        })
        .then(function(response) {
          return response.json(); 
        })
        .then(function(json) {
          self.$emit('update-form', json);
        });
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
      this.$emit('update-site', data);
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
    'site-form': SiteForm
  }
}