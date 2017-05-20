//Vue component for editing and controlling a railroad on the form

var RailForm = {
	template: `
		<div class="card" v-if="editing">
	    
	    <div class="card-header">
	      <p class="card-header-title">Editing: {{ editValues.name }}</p>
	    </div>

	    <div class="card-content">

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Name</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.name" maxlength="80">
                <p class="help is-danger" v-show="nameIsValid == false">Required. Letters, numbers and , . - only</p>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Distance</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.distance" maxlength="10">
                <p class="help is-danger" v-show="distanceIsValid == false">Required. Must be numeric</p>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Speed</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.speed" maxlength="4">
                <p class="help is-danger" v-show="speedIsValid == false">Required. Must be a number in MPH</p>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Engines per Train</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.engines_per_train" maxlength="4">
                <p class="help is-danger" v-show="enginesPerTrainIsValid == false">Required. Must be a number</p>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Rail Cars per Train</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.cars_per_train" maxlength="5">
                <p class="help is-danger" v-show="carsPerTrainIsValid == false">Required. Must be a number</p>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Operations per Day</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.ato" maxlength="5">
                <p class="help is-danger" v-show="atoIsValid == false">Required. Must be a number</p>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Night Fraction</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.night_fraction" maxlength="10">
                <p class="help is-danger" v-show="nightFractionIsValid == false">Required. Must be a number</p>
              </div>
            </div>
          </div>
        </div>

				<div class="field">
				  <p class="control">
				    <label class="checkbox">
				      <input type="checkbox" v-model="editValues.diesel">
				      Diesel
				    </label>
				  </p>
				</div>

				<div class="field">
				  <p class="control">
				    <label class="checkbox">
				      <input type="checkbox" v-model="editValues.horns">
				      Horns
				    </label>
				  </p>
				</div>

				<div class="field">
				  <p class="control">
				    <label class="checkbox">
				      <input type="checkbox" v-model="editValues.bolted_tracks">
				      Bolted Tracks
				    </label>
				  </p>
				</div>

	      <div class="field is-horizontal">
          <div class="field-label is-normal">
          <!-- blank for spacing -->
          </div>
          <div class="field">
            <div class="control is-grouped">
              <button class="button" v-on:click="cancelEdit">Cancel</button>
              <button class="button is-primary" v-on:click="saveEdit" :disabled="formIsValid == false">Save</button>
            </div>
          </div>
        </div>

	    </div>

	  </div>

    <rail-card 
      v-else
      v-bind:index="index"
      v-bind:rail="rail"
      @remove-rail="onRemoveRail"
      @edit-rail="onEditRail"
    ></rail-card>
	`,

	computed: {
    atoIsValid: function() {
      return isNumeric(this.editValues.ato);
    },

    carsPerTrainIsValid: function() {
      return isNumeric(this.editValues.cars_per_train);
    },

    distanceIsValid: function() {
      return isNumeric(this.editValues.distance);
    },

    enginesPerTrainIsValid: function() {
      return isNumeric(this.editValues.engines_per_train);
    },

    formIsValid: function() {
      return this.atoIsValid && this.carsPerTrainIsValid && this.distanceIsValid && this.enginesPerTrainIsValid &&
        this.nameIsValid && this.nightFractionIsValid && this.speedIsValid;
    },

    nameIsValid: function() {
      var p = new RegExp(okString());
      return p.test(this.editValues.name);
    },

    nightFractionIsValid: function() {
      return isNumeric(this.editValues.night_fraction);
    },

    speedIsValid: function() {
      return isSpeed(this.editValues.speed);
    }
	},

	methods: {

    cancelEdit: function() {
      this.editing = false;
    },

    onEditRail: function() {
      //populate form with copy of rail data and put form into edit mode
      this.editValues = JSON.parse(JSON.stringify(this.rail));
      this.editing = true;
    },

    onRemoveRail: function() {
      //relay the remove-road event up
      this.$emit('remove-rail', this.index);
    },

    saveEdit: function() {
      //invalidate rail dnl calculation
      this.editValues.dnl = null;
      //send up new values to replace current values
      this.$emit('update-rail', this.index, this.editValues);
      this.editing = false;
    },
	},

	props: [ 'index', 'rail' ],

  data: function() {
    return {
      editing: this.editing,
      editValues: this.editValues,
    }
  },

  editing: false,

  editValues: {},

  components: {
  	'rail-card': RailCard
  }
}