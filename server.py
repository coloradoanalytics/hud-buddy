from math import radians, cos, sin, asin, sqrt, pow

from flask import Flask, request, json, render_template
import requests
app = Flask(__name__)


def adjust(speed):
    return float(pow(speed, 2.025)) * float(.0003)


def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radius of earth in kilometers. Use 3956 for miles
    return c * r


@app.route("/")
def home():
    return render_template('index.html')


@app.route("/api/highways/")
def highways():
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    distance = request.args.get('distance', 304.8)

    s = requests.session()

    highway_url = "https://data.colorado.gov/resource/phvc-rwei.json"
    payload = {"$where": "within_circle(the_geom, {}, {}, {})".format(
        lat, lon, distance)}

    highways = s.get(highway_url, params=payload).json()
    highway_names = set([h['alias'] for h in highways])

    final_segments = []

    for name in highway_names:
        segments = [h for h in highways if h['alias'] == name]

        seg = min(segments, key=lambda x: min(
            ([haversine(lon, lat, c[0], c[1]) for c in x['the_geom']['coordinates']])))
        truck_percentage = (float(seg['aadtcomb']) / float(seg['aadt'])) * 100
        closest_segment = {
            'name': seg['alias'],
            'aadt': seg['aadt'],
            'year': seg['aadtyr'],
            'county': seg['county'],
            'speed_limit': seg['speedlim'],
            'speed_adjustment_factor': adjust(float(seg['speedlim'])),
            'truck_percentage': truck_percentage,
        }
        final_segments.append(closest_segment)

    county_names = set([s['county'] for s in final_segments])
    population_url = "https://data.colorado.gov/resource/tv8u-hswn.json"
    population_payload = {"county": "Denver", "year": "2014"}
    population_res = s.get(population_url, params=population_payload)
    counties = population_res.json()
    current_pop = sum([float(c['totalpopulation']) for c in counties])

    population_payload = {"county": "Denver", "year": "2027"}
    population_res = s.get(population_url, params=population_payload)
    counties = population_res.json()
    future_pop = sum([float(c['totalpopulation']) for c in counties])

    nighttime_fraction = float(3.813) * float(.15) + .425

    response = []

    for seg in final_segments:
        response_object = {}
        future_aadt = (future_pop / current_pop) * float(seg['aadt'])
        truck_count = future_aadt * \
            (float(seg['truck_percentage']) / float(100))
        auto_count = future_aadt - truck_count
        autos_mt_ten = auto_count + (10 * truck_count)
        effective_future_aadt = seg[
            'speed_adjustment_factor'] * nighttime_fraction * autos_mt_ten

        response_object['street_name'] = seg['name']
        response_object['county'] = seg['county']
        response_object['current_aadt'] = seg['aadt']
        response_object['effective_future_aadt'] = str(
            round(effective_future_aadt, 1))
        response.append(response_object)

    return json.jsonify(response)


if __name__ == "__main__":
    app.run()
