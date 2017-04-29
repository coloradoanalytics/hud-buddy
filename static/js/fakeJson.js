function fakeJson(position) {
  return {
  site_name: "300 Noisy Lane - north side",
  date: "iso8601datestring",
  user_name:"Bob the Builder",
  growth_rate: 0.015,
  position: position,
  county: {name: "Adams"},
  combined_dnl: 66,
  roads: [
    {
      name: "I-70",
      counted_adt: 113000,
      counted_adt_year: 2015,
      adt: 127555,
      adt_year: 2027,
      night_fraction_autos: 0.15,
      night_fraction_trucks: 0.15,
      distance: 235,
      stop_sign_distance: 0,
      grade: 0.02,
      medium_trucks: 0.02,
      heavy_trucks: 0.025,
      speed_autos: 75,
      speed_trucks: 70,
      dnl: 65.5
    }
  ],
  rails: [
    {
      name: "UPRR at Noisy Lane",
      diesel: true,
      distance: 1560,
      speed: 45,
      engines_per_train: 2,
      cars_per_train: 60,
      ato: 8,
      night_fraction: 0.15,
      horns: false,
      bolted_tracks: false,
      dnl: 55.9
    }
  ],
  airports: [
    {
      name: "Denver International",
      distance: 23500,
      contours: true,
      dnl: 54,
      nighttime_jets: 0,
      daytime_jets: 0,
      runway: [ {lat: 35.678, lng: -38.987}, {lat: 35.685, lng: -38.785} ]
    }
  ]
}
};