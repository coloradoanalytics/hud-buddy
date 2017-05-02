var SiteForm = {
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
            <label class="label">Growth Rate</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.growth_rate">
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">User Name</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.user_name">
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
              <button class="button is-primary" v-on:click="saveEdit">Save</button>
            </div>
          </div>
        </div>

      </div>
		</div>

		<site-card
			v-else
			:site-data="siteData"
			@reset-form="onResetForm"
			@get-calculation="onGetCalculation"
			@edit-site="onEditSite"
		></site-card>
	`,

	props: [ 'form-data' ],

	methods: {

		cancelEdit: function() {
			this.editing = false;
		},

		onEditSite: function() {
      //populate form with copy of site data and put form into edit mode
      this.editValues = JSON.parse(JSON.stringify(this.siteData));
      this.editing = true;
    },

    onGetCalculation: function() {
    	this.$emit('get-calculation');
    },

		onResetForm: function() {
			//relay reset-form event
			this.$emit('reset-form');
		},

		saveEdit: function() {
      //invalidate dnl calculation
      this.editValues.combined_dnl = null;
      //send up new values to replace current values
      this.$emit('update-site', this.editValues);
      this.editing = false;
		}

	},

	components: {
		'site-card': SiteCard
	},

	data: function() {
		return {
			editing: this.editing,
			editValues: this.editValues,
		}
	},

	computed: {
		siteData: function() {
			return {
				name: this.formData.name,
				county: this.formData.county,
				combined_dnl: this.formData.combined_dnl,
				growth_rate: this.formData.growth_rate,
				date: this.formData.date,
				user_name: this.formData.user_name
			}
		}
	},

	editing: false,

	editValues: {}
}