var RoadCard = {

	template: `
		<div class="card">

      <header class="card-header">
        <p class="card-header-title">
          {{road.name}}
        </p>
        <a class="card-header-icon" >
          <span class="tag is-medium" v-html="roadDnl"></span>
        </a>
        <a class="card-header-icon" v-on:click="editRoad()">
          <span class="icon">
            <i class="fa fa-pencil"></i>
          </span>
        </a>
        <a class="card-header-icon">
          <span class="icon" v-on:click="removeRoad()">
            <i class="fa fa-trash"></i>
          </span>
        </a>
      </header>

      <div class="card-content">
        <table class="table">
          <thead>
            <tr>
              <th>Traffic</th>
              <th style="text-align:center">ADT</th>
              <th style="text-align:center">Percent of ADT</th>
              <th style="text-align:center">Night Fraction</th>
              <th style="text-align:center">Speed (mph)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total</td>
              <td class="has-text-centered">{{ totalAdt }}</td>
              <td colspan="3"></td>
            <tr>
            <tr>
              <td>Autos</td>
              <td class="has-text-centered">{{ autosAdt }}</td>
              <td class="has-text-centered">{{ autosPercent }}%</td>
              <td class="has-text-centered">{{ autosNight }}%</td>
              <td class="has-text-centered">{{ road.speed_autos }}</td>
            </tr>
            <tr>
              <td>Medium Trucks</td>
              <td class="has-text-centered">{{ mediumTrucksAdt }}</td>
              <td class="has-text-centered">{{ mediumTrucksPercent }}%</td>
              <td class="has-text-centered">{{ mediumTrucksNight }}%</td>
              <td class="has-text-centered">{{ road.speed_autos }}</td>
            </tr>
            <tr>
              <td>Heavy Trucks</td>
              <td class="has-text-centered">{{ heavyTrucksAdt }}</td>
              <td class="has-text-centered">{{ heavyTrucksPercent }}%</td>
              <td class="has-text-centered">{{ heavyTrucksNight }}%</td>
              <td class="has-text-centered">{{ road.speed_trucks }}</td>

            </tr>
          </tbody>
        </table>

        <table class="table">
          <thead>
            <tr>
              <th style="text-align:center">Effective Distance (feet)</th>
              <th style="text-align:center">Grade</th>
              <th style="text-align:center">Distance to Stop Sign (feet)</th>
              <th style="text-align:center">For Year</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="has-text-centered">{{ distance }}</td>
              <td class="has-text-centered">{{ grade }}%</td>
              <td class="has-text-centered">{{ stopSignDistance }}</td>
              <td class="has-text-centered">{{ road.adt_year }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
	`,

	computed: {
		autosAdt: function() {
			if (this.road.adt) {
    		p = 1 - this.road.heavy_trucks - this.road.medium_trucks;
      	p = Math.round(p * this.road.adt);
      	return numberWithCommas(p);
    	}
    	return 0;
    },

    autosPercent: function() {
      p = 1 - this.road.heavy_trucks - this.road.medium_trucks;
      return (Math.round(p * 10000)/100).toFixed(2);
    },

    autosNight: function() {
      return (this.road.night_fraction_autos * 100).toFixed(2);
    },

    distance: function() {
      return roundToFive(this.road.distance);
    },

    grade: function() {
      return (this.road.grade * 100).toFixed(2);
    },

    heavyTrucksAdt: function() {
      if (this.road.adt) {
        return numberWithCommas(Math.round(this.road.heavy_trucks * this.road.adt));
      }
      return 0;      
    },

    heavyTrucksNight: function() {
      return (this.road.night_fraction_trucks * 100).toFixed(2);
    },

    heavyTrucksPercent: function() {
      return (Math.round(this.road.heavy_trucks * 10000)/100).toFixed(2);
    },

    mediumTrucksAdt: function() {
      if (this.road.adt) {
        return numberWithCommas(Math.round(this.road.medium_trucks * this.road.adt));
      }
      return 0;  
    },

    mediumTrucksNight: function() {
      return (this.road.night_fraction_autos * 100).toFixed(2);
    },

    mediumTrucksPercent: function() {
      return (Math.round(this.road.medium_trucks * 10000)/100).toFixed(2);
    },

    roadDnl: function() {
      if (this.road.dnl) {
        return "<b>" + this.road.dnl.toString() + "</b> &nbsp; dB";
      }
      return "--"
    },

    stopSignDistance: function() {
      return roundToFive(this.road.stop_sign_distance);
    },

    totalAdt: function() {
      if (this.road.adt) return numberWithCommas(Math.round(this.road.adt));
      return 0;
    },
	},

	methods: {

    editRoad: function(index) {
      this.$emit('edit-road', index);
    },

    removeRoad: function() {
      this.$emit('remove-road');
    }
	},

	props: [ "index", "road" ]
}


var RoadForm = {
  template: `

    <div class="panel" v-if="editing">
      <div class="panel-block">
        <label class="label">Road Name</label>
        <input class="input" type="text" v-model="editValues.name">
      </div>
      <div class="panel-block">
        <label class="label">ADT</label>
        <input class="input" type="text" v-model="editValues.adt">
      </div>
      <div class="panel-block">
        <a class="button" v-on:click="cancelEdit">Cancel</a>
        <a class="button is-primary" v-on:click="saveEdit">Save</a>
      </div>
    </div>


    <road-card 
      v-else
      :index="index"
      :road="road"
      @remove-road="onRemoveRoad"
      @edit-road="onEditRoad"
    ></road-card>
  `,

  computed: {

  },

  methods: {
    cancelEdit: function() {
      this.editing = false;
    },

    onEditRoad: function() {
      //populate form with copy of road data and put form into edit mode
      this.editValues = JSON.parse(JSON.stringify(this.road));
      this.editing = true;
    },

    onRemoveRoad: function() {
      this.$emit('remove-road', this.index);
    },

    saveEdit: function() {
      this.$emit('update-road', this.index, this.editValues);
      this.editing = false;
    }
  },

  props: [ 'index', 'road' ],

  data: function() {
    return {
      editing: this.editing,
      editValues: this.editValues
    }
  },

  components: {
    'road-card': RoadCard
  },

  editing: false,

  editValues: {}
}