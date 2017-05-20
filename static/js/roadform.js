//Vue component for editing and controlling a road on the form

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
                <input class="input" type="text" v-model="editValues.distance">
                <p class="help is-danger" v-show="distanceIsValid == false">Required. Must be numeric</p>
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
                <p class="help is-danger" v-show="adtIsValid == false">Required. Must be a number</p>
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
                <p class="help is-danger" v-show="adtYearIsValid == false">Must be a year</p>
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
                <p class="help">Total ADT from published traffic count</p>
                <p class="help is-danger" v-show="countedAdtIsValid == false">Must be a number</p>
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
                <p class="help">Year of published traffic count</p>
                <p class="help is-danger" v-show="countedAdtYearIsValid == false">Must be a year</p>
              </div>
              <div class="control">
                <a class="button is-info" v-on:click="projectAdt" :disabled="projectionValuesValid == false">Calculate</a>
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
              <td>
                <input class="input" type="text" v-model="editValues.auto.night_fraction">
                <p class="help is-danger" v-show="autosNightFractionIsValid == false">Must be a number</p>
              </td>
              <td>
                <input class="input" type="text" v-model="editValues.auto.speed">
                <p class="help is-danger" v-show="autosSpeedIsValid == false">Must be a number in MPH</p>
              </td>
            </tr>
            <tr>
              <td>Medium Trucks</td>
              <td>{{ mediumTrucksAdt }}</td>
              <td>
                <input class="input" type="text" v-model="editValues.medium_truck.adt_fraction">
                <p class="help is-danger" v-show="mediumTrucksFractionIsValid == false">Must be a number</p>
              </td>
              <td>
                <input class="input" type="text" v-model="editValues.medium_truck.night_fraction">
                <p class="help is-danger" v-show="mediumTrucksNightFractionIsValid == false">Must be a number</p>
              </td>
              <td>
                <input class="input" type="text" v-model="editValues.medium_truck.speed">
                <p class="help is-danger" v-show="mediumTrucksSpeedIsValid == false">Must be a number in MPH</p>
              </td>
            </tr>
            <tr>
              <td>Heavy Trucks</td>
              <td>{{ heavyTrucksAdt }}</td>
              <td>
                <input class="input" type="text" v-model="editValues.heavy_truck.adt_fraction">
                <p class="help is-danger" v-show="heavyTrucksFractionIsValid == false">Must be a number</p>
              </td>
              <td>
                <input class="input" type="text" v-model="editValues.heavy_truck.night_fraction">
                <p class="help is-danger" v-show="heavyTrucksNightFractionIsValid == false">Must be a number</p>
              </td>
              <td>
                <input class="input" type="text" v-model="editValues.heavy_truck.speed">
                <p class="help is-danger" v-show="heavyTrucksSpeedIsValid == false">Must be a number in MPH</p>
              </td>
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
              <p class="help">Leave blank if no stop sign or greater than 600 feet</p>
              <p class="help is-danger" v-show="stopSignDistanceIsValid == false">Must be a number</p>
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
              <p class="help">0.02 (2%) default. Use 0 if less than 2%</p>
              <p class="help is-danger" v-show="gradeIsValid == false">Must be a number</p>
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

    <road-card 
      v-else
      v-bind:index="index"
      v-bind:road="road"
      @remove-road="onRemoveRoad"
      @edit-road="onEditRoad"
    ></road-card>
  `,

  computed: {
    adtIsValid: function() {
      return isNumeric(this.editValues.adt);
    },

    adtYearIsValid: function() {
      return isYear(this.editValues.adt_year);
    },

    autosAdt: function() {
      //calculate number of autos based on ADT and truck percentages
      if (this.road.adt) {
        p = 1 - this.editValues.heavy_truck.adt_fraction - this.editValues.medium_truck.adt_fraction;
        p = Math.round(p * this.editValues.adt);
        return numberWithCommas(p);
      }
      return 0;
    },

    autosNightFractionIsValid: function() {
      return isNumeric(this.editValues.auto.night_fraction);
    },

    autosSpeedIsValid: function() {
      return isSpeed(this.editValues.auto.speed);
    },

    autosPercent: function() {
      p = 1 - this.editValues.heavy_truck.adt_fraction - this.editValues.medium_truck.adt_fraction;
      return (Math.round(p * 10000)/100).toFixed(2);
    },

    countedAdtIsValid: function() {
      return isNumeric(this.editValues.counted_adt);
    },

    countedAdtYearIsValid: function() {
      return isYear(this.editValues.counted_adt_year);
    },

    distanceIsValid: function() {
      return isNumeric(this.editValues.distance);
    },

    formIsValid: function() {
      return this.nameIsValid && this.distanceIsValid && this.adtIsValid && this.adtYearIsValid &&
        this.autosNightFractionIsValid && this.mediumTrucksNightFractionIsValid && this.heavyTrucksNightFractionIsValid &&
        this.autosSpeedIsValid && this.mediumTrucksSpeedIsValid && this.heavyTrucksSpeedIsValid && this.mediumTrucksFractionIsValid &&
        this.heavyTrucksFractionIsValid && this.stopSignDistanceIsValid && this.gradeIsValid;
    },

    gradeIsValid: function() {
      return isNumeric(this.editValues.grade);
    },

    heavyTrucksAdt: function() {
      if (this.editValues.adt) {
        return numberWithCommas(Math.round(this.editValues.heavy_truck.adt_fraction * this.editValues.adt));
      }
      return 0;      
    },

    heavyTrucksFractionIsValid: function() {
      return isNumeric(this.editValues.heavy_truck.adt_fraction);
    },

    heavyTrucksNightFractionIsValid: function() {
      return isNumeric(this.editValues.heavy_truck.night_fraction);
    },

    heavyTrucksSpeedIsValid: function() {
      return isSpeed(this.editValues.heavy_truck.speed);
    },

    mediumTrucksAdt: function() {
      if (this.editValues.adt) {
        return numberWithCommas(Math.round(this.editValues.medium_truck.adt_fraction * this.editValues.adt));
      }
      return 0;      
    },

    mediumTrucksFractionIsValid: function() {
      return isNumeric(this.editValues.medium_truck.adt_fraction);
    },

    mediumTrucksNightFractionIsValid: function() {
      return isNumeric(this.editValues.medium_truck.night_fraction);
    },

    mediumTrucksSpeedIsValid: function() {
      return isSpeed(this.editValues.medium_truck.speed);
    },

    nameIsValid: function() {
      var p = new RegExp(okString());
      return p.test(this.editValues.name);
    },

    projectionValuesValid: function() {
      return this.adtYearIsValid && this.countedAdtIsValid && this.countedAdtYearIsValid;
    },

    stopSignDistanceIsValid: function() {
      if (this.editValues.stop_sign_distance == null) return true;
      if (this.editValues.stop_sign_distance == '') {
        this.editValues.stop_sign_distance = null;
        return true;
      }
      return isNumeric(this.editValues.stop_sign_distance);
    }
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
      //convert a deleted stop sign distance to null
      if (this.editValues.stop_sign_distance == '') this.editValues.stop_sign_distance = null;
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