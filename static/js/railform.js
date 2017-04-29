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
                <input class="input" type="text" v-model="editValues.name">
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
                <input class="input" type="text" v-model="editValues.distance">
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
                <input class="input" type="text" v-model="editValues.speed">
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
                <input class="input" type="text" v-model="editValues.engines_per_train">
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
                <input class="input" type="text" v-model="editValues.cars_per_train">
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
                <input class="input" type="text" v-model="editValues.ato">
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
                <input class="input" type="text" v-model="editValues.night_fraction">
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
              <button class="button is-primary" v-on:click="saveEdit">Save</button>
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