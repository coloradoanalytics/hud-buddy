//Vue component to display railroad details on form interface

var RailCard = {
	template: `
		<div class="card">

      <header class="card-header">
        <p class="card-header-title">
          {{rail.name}}
        </p>
        <a class="card-header-icon" >
          <span class="tag is-medium" v-html="railDnl"></span>
        </a>
        <a class="card-header-icon" v-on:click="editRail()">
          <span class="icon">
            <i class="fa fa-pencil"></i>
          </span>
        </a>
        <a class="card-header-icon">
          <span class="icon" v-on:click="removeRail()">
            <i class="fa fa-trash"></i>
          </span>
        </a>
      </header>

      <div class="card-content">

      	<table class="table">
          <thead>
            <tr>
              <th style="text-align:center">Effective Distance (feet)</th>
              <th style="text-align:center">Speed (mph)</th>
              <th style="text-align:center">Engines per Train</th>
              <th style="text-align:center">Cars per Train</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="has-text-centered">{{ rail.distance }}</td>
              <td class="has-text-centered">{{ rail.speed }}</td>
              <td class="has-text-centered">{{ rail.engines_per_train }}</td>
              <td class="has-text-centered">{{ rail.cars_per_train }}</td>
            </tr>
          </tbody>
        </table>

      	<table class="table">
          <thead>
            <tr>
              <th style="text-align:center">Trains per Day</th>
              <th style="text-align:center">Night Fraction</th>
              <th style="text-align:center">Diesel</th>
              <th style="text-align:center">Horns</th>
              <th style="text-align:center">Bolted Tracks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="has-text-centered">{{ rail.ato }}</td>
              <td class="has-text-centered">{{ nightPercent }}%</td>
              <td class="has-text-centered">{{ diesel }}</td>
              <td class="has-text-centered">{{ horns }}</td>
              <td class="has-text-centered">{{ bolted }}</td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
	`,

	computed: {
		bolted: function() {
			if (this.rail.bolted_tracks) return "Yes";
			return "No";
		},

		diesel: function() {
			if (this.rail.diesel) return "Yes";
			return "No";
		},

		horns: function() {
			if (this.rail.horns) return "Yes";
			return "No";
		},

		nightPercent: function() {
			return (this.rail.night_fraction * 100).toFixed(2);
		},

		railDnl: function() {
      if (this.rail.dnl != null) {
        return "<b>" + this.rail.dnl.toString() + "</b> &nbsp; dB";
      }
      return "--";
		}
	},

	methods: {

    editRail: function() {
      this.$emit('edit-rail');
    },

    removeRail: function() {
      this.$emit('remove-rail');
    }
	},

	props: [ "index", "rail" ]

}