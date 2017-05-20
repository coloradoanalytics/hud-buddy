//Vue component that handles an airport on the form page.

var AirportForm = {
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
            <label class="label">Airport DNL</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.dnl">
                <p class="help is-danger" v-show="dnlIsValid == false">Required for valid calculation. Must be a number</p>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Distance in feet</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.distance" maxlength="10">
                <p class="help is-danger" v-show="distanceIsValid == false">Must be a number</p>
              </div>
            </div>
          </div>
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

		<airport-card 
      v-else
      v-bind:airport="airport"
      @remove-airport="onRemoveAirport"
      @edit-airport="onEditAirport"
    ></airport-card>
	`,

  computed: {

    distanceIsValid: function() {
      return isNumeric(this.editValues.distance);
    },

    dnlIsValid: function() {
      return isNumeric(this.editValues.dnl) && this.editValues.dnl > 0;
    },

    formIsValid: function() {
      return this.dnlIsValid && this.nameIsValid && this.distanceIsValid;
    },

    nameIsValid: function() {
      var p = new RegExp(okString());
      return p.test(this.editValues.name);
    },
  },

  methods: {

    cancelEdit: function() {
      this.editing = false;
    },

    onEditAirport: function() {
      //populate form with copy of rail data and put form into edit mode
      this.editValues = JSON.parse(JSON.stringify(this.airport));
      this.editing = true;
    },

    onRemoveAirport: function() {
      //relay the remove-road event up
      this.$emit('remove-airport', this.index);
    },

    saveEdit: function() {
      //send up new values to replace current values
      this.$emit('update-airport', this.index, this.editValues);
      this.editing = false;
    },
  },

  props: [ 'index', 'airport' ],

  data: function() {
    return {
      editing: this.editing,
      editValues: this.editValues,
    }
  },

  editing: false,

  editValues: {},

  components: {
    'airport-card': AirportCard
  }
}