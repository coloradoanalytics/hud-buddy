var SiteForm = {
	template: `
		<div class="card" v-if="editing">
			<div class="card-header">
        <p class="card-header-title">Editing: {{ editValues.name }}</p>
        <
      </div>

      <div class="card-content">

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Site Name/ID</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.name" name="name">
                <p class="help is-danger" v-show="nameIsValid == false">Required. Letters, numbers and , . - only.</p>
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
                <p class="help is-danger" v-show="growthRateIsValid == false">Must be a number.</p>
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
                <p class="help is-danger" v-show="userNameIsValid == false">Letters, numbers and , . - only.</p>
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


		<site-card
			v-else
			:site-data="siteData"
      :form-data="formData"
			@reset-form="onResetForm"
			@get-calculation="onGetCalculation"
			@edit-site="onEditSite"
      @get-report="onGetReport"
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

    onGetReport: function() {
      this.$emit('get-report')
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
    },

    formIsValid: function() {
      return this.nameIsValid && this.growthRateIsValid && this.userNameIsValid;
    },

    growthRateIsValid: function() {
      if (this.editValues.growth_rate == null) return true;
      if (this.editValues.growth_rate == '') {
        this.editValues.growth_rate = null;
        return true;
      }
      return isNumeric(this.editValues.growth_rate);
    },

    nameIsValid: function() {
      var p = new RegExp(okString());
      return p.test(this.editValues.name);
    },

    userNameIsValid: function() {
      if (this.editValues.user_name == null || this.editValues.user_name == '') return true;
      var p = new RegExp(okString());
      return p.test(this.editValues.user_name);
    }

  },

	data: function() {
		return {
			editing: this.editing,
			editValues: this.editValues
		}
	},

	editing: false,

	editValues: {}

}