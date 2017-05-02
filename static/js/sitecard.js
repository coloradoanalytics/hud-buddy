var SiteCard = {
	template: `
		<div class="card">

			<header class="card-header">
        <p class="card-header-title">{{ siteData.name }}</p>
        <a class="card-header-icon" v-on:click="editSite()">
          <span class="icon">
            <i class="fa fa-pencil"></i>
          </span>
        </a>
        <a class="card-header-icon" >
        	<span class="tag is-large is-primary" v-html="combinedDnl"></span>
        </a>
      </header>

      <div class="card-content">
      	<div>County: {{ countyName }}</div>
      	<div>Growth rate: {{ growthRate }}%</div>
      	<div>User: {{ siteData.user_name }}</div>
      </div>

      <footer class="card-footer">
        <a class="card-footer-item" v-on:click="resetForm">Reset</a>
        <a class="card-footer-item">Generate Report</a>
        <a class="card-footer-item is-primary" v-on:click="getCalculation">Calculate</a>
      </footer>

    </div>
	`,

	props: [ 'site-data' ],

  computed: {
    combinedDnl: function() {
    if (this.siteData.combined_dnl) {
        return "<b>" + this.siteData.combined_dnl.toString() + "</b> &nbsp; dB";
      }
      return "--"
    },

    countyName: function() {
    	if (this.siteData.county && this.siteData.county.name) return this.siteData.county.name;
    	return '--';
    },

    growthRate: function() {
      return (Math.round(this.siteData.growth_rate * 10000)/100).toFixed(2);
    }
  },

	methods: {
		editSite() {
			this.$emit('edit-site');
		},

		getCalculation: function() {
			this.$emit('get-calculation');
		},

    resetForm: function() {
      this.$emit('reset-form');
    },
	}
}