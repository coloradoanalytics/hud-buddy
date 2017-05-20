//handy functions used throughout

function okString() {
  //for validating strings
  return "^[A-Za-z0-9 _,./-]*[A-Za-z0-9][A-Za-z0-9 _,./-]*$";
}

function isNumeric(value) {
  //for validating numbers
  return !isNaN(parseFloat(value)) && isFinite(value);
}

function isYear(value) {
  //for validating years
  if (value == null || value.length < 4 || value.length > 4) return false;
  var p = /^[0-9]+$/;
  return p.test(value);
}

function isSpeed(value) {
  //for validing MPH values
  if (value == null || value.length < 1 || value.length > 2) return false;
  var p = /^[0-9]+$/;
  return p.test(value);
}

function numberWithCommas(x) {
  //format a number with thousands commas
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function blankAirport() {
  //create a new, empty airport object
  return {
    name: "New Airport",
    airport_type: "",
    distance: null,
    annual_ops: null,
    dnl: null
  }
}

function blankRoad() {
  //create a new, empty road object
  var date = new Date();
  return {
    name: "Road",
    counted_adt: null,
    counted_adt_year: null,
    adt: 1000,
    adt_year: date.getYear() + 1900 + 10,
    distance: 200,
    stop_sign_distance: null,
    grade: 0.02,
    dnl: null,
    auto: {
      night_fraction: 0.15,
      speed: 55,
    },
    medium_truck: {
      adt_fraction: 0.02,
      night_fraction: 0.15,
      speed: 55
    },
    heavy_truck: {
      adt_fraction: 0.05,
      night_fraction: 0.15,
      speed: 55
    }
  }
}

function blankRail() {
  //create a new, empty railroad object
  return {
    name: "New Rail",
    distance: 1000,
    speed: 30,
    diesel: true,
    engines_per_train: 2,
    cars_per_train: 50,
    ato: 0,
    night_fraction: 0.15,
    horns: false,
    bolted_tracks: false,
    dnl: null,
    railroad: "-railroad-",
    branch: "-branch-",
    division: "-division-",
    subdivision: "-subdivision-",
    rr_class: "",
    rrowner_1: "-owner-",
    status: "-status-"
  }
}

function blankSite() {
  //create a new, empty site object
  var d = new Date();
  return {
    name: 'NAL',
    date: d.toJSON(),
    user_name: "",
    growth_rate: 0.015,
    position: {lat: null, lng: null},
    county: {name: ''},
    combined_dnl: null,
    roads: [],
    rails: [],
    airports: []
  };
}

function newGUID() {
    //create a random GUID string
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

var getColor = function(dnl) {
  //return a color that corresponds to a site's HUD classification
  var color = 'green';

  if (dnl > 75) {
    color = 'red';
  } else if (dnl > 70) {
    color = 'orange';
  } else if (dnl > 65) {
    color = 'yellow';
  }

  return color;

}

var getDescription = function(dnl) {
  //return a string that corresponds to a site's HUD classification
  var desc = 'Acceptable';

  if (dnl > 75) {
    desc = 'Unacceptable';
  } else if (dnl > 65) {
    desc = 'Normally Unacceptable';
  }

  return desc;
}

var spinnerHTML = `
        <div class="spinner">
          <div class="bounce1"></div>
          <div class="bounce2"></div>
          <div class="bounce3"></div>
        </div>
        `

function roundToFive(x) {
  //rounds a value to the nearest 5
  //useful for inexact values, like distances
  return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}