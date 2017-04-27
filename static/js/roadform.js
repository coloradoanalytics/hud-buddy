var RoadForm = {
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
            <label class="label">Total ADT</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.adt">
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Design Year</label>
          </div>
          <div class="field-body">
            <div class="field is-grouped">
              <div class="control is-expanded">
                <input class="input" type="text" v-model="editValues.adt_year">
              </div>
              <div class="control">
                <a class="button is-info" v-on:click="toggleProjection">Projection</a>
              </div>
            </div>
          </div>
        </div>

        <template v-if="showProjection">

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Counted ADT</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.counted_adt">
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Traffic Count Year</label>
          </div>
          <div class="field-body">
            <div class="field is-grouped">
              <div class="control is-expanded">
                <input class="input" type="text" v-model="editValues.counted_adt_year">
              </div>
              <div class="control">
                <a class="button is-info" v-on:click="projectAdt">Calculate</a>
              </div>
            </div>
          </div>
        </div>

        </template>

        <table class="table">
          <thead>
            <tr>
              <th>Traffic</th>
              <th>ADT</th>
              <th>Fraction</th>
              <th>Night</th>
              <th>Speed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Autos</td>
              <td>{{ autosAdt }}</td>
              <td>{{ autosPercent }}%</td>
              <td><input class="input" type="text" v-model="editValues.night_fraction_autos"></td>
              <td><input class="input" type="text" v-model="editValues.speed_autos"></td>
            </tr>
            <tr>
              <td>Medium Trucks</td>
              <td>{{ mediumTrucksAdt }}</td>
              <td><input class="input" type="text" v-model="editValues.medium_trucks"></td>
              <td><input class="input" type="text" v-model="editValues.night_fraction_trucks"></td>
              <td><input class="input" type="text" v-model="editValues.speed_autos"></td>
            </tr>
            <tr>
              <td>Heavy Trucks</td>
              <td>{{ heavyTrucksAdt }}</td>
              <td><input class="input" type="text" v-model="editValues.heavy_trucks"></td>
              <td><input class="input" type="text" v-model="editValues.night_fraction_trucks"></td>
              <td><input class="input" type="text" v-model="editValues.speed_trucks"></td>
            </tr>
          </tbody>
        </table>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Distance to Stop Sign</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.stop_sign_distance">
              </div>
              <p class="help">Use 0 if greater than 600 feet</p>
            </div>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Grade</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="editValues.grade">
              </div>
              <p class="help">2% default. Use 0 if less than 2%</p>
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


    <road-card 
      v-else
      :index="index"
      :road="road"
      @remove-road="onRemoveRoad"
      @edit-road="onEditRoad"
    ></road-card>
  `,

  computed: {
    autosAdt: function() {
      if (this.road.adt) {
        p = 1 - this.editValues.heavy_trucks - this.editValues.medium_trucks;
        p = Math.round(p * this.editValues.adt);
        return numberWithCommas(p);
      }
      return 0;
    },

    autosPercent: function() {
      p = 1 - this.editValues.heavy_trucks - this.editValues.medium_trucks;
      return (Math.round(p * 10000)/100).toFixed(2);
    },

    heavyTrucksAdt: function() {
      if (this.editValues.adt) {
        return numberWithCommas(Math.round(this.editValues.heavy_trucks * this.editValues.adt));
      }
      return 0;      
    },

    mediumTrucksAdt: function() {
      if (this.editValues.adt) {
        return numberWithCommas(Math.round(this.editValues.medium_trucks * this.editValues.adt));
      }
      return 0;      
    },
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
      //relay the remove-road event up
      this.$emit('remove-road', this.index);
    },

    projectAdt: function() {
      //use the growth rate and provided traffic count to project traffic for the design year
      var numYears = this.editValues.adt_year - this.editValues.counted_adt_year;
      var futureAdt = this.editValues.counted_adt * Math.exp(this.growthRate * numYears);
      this.editValues.adt = Math.round(futureAdt);
    },

    saveEdit: function() {
      //invalidate road dnl calculation
      this.editValues.dnl = null;
      //send up new values to replace current values
      this.$emit('update-road', this.index, this.editValues);
      this.editing = false;
    },

    toggleProjection: function() {
      this.showProjection = !this.showProjection;
    }
  },

  props: [ 'index', 'road', 'growth-rate' ],

  data: function() {
    return {
      editing: this.editing,
      editValues: this.editValues,
      showProjection: this.showProjection
    }
  },

  components: {
    'road-card': RoadCard
  },

  editing: false,

  editValues: {},

  showProjection: false
}