from flask import Flask, request, json, current_app

import requests

from clients import HighwaysClient, RailroadsClient
from locations import Position
from sites import Site, SiteSchema


# use custom Flask delimiters to prevent collision with Vue
# https://github.com/yymm/flask-vuejs
class CustomFlask(Flask):
    jinja_options = Flask.jinja_options.copy()
    jinja_options.update(dict(
        block_start_string='(%',
        block_end_string='%)',
        variable_start_string='((',
        variable_end_string='))',
        comment_start_string='(#',
        comment_end_string='#)',
    ))

app = CustomFlask(__name__)


@app.route("/")
def home():
    return current_app.send_static_file('html/index.html')


@app.route("/api/sites/", methods=['GET', 'POST'])
def sites():
    if request.method == 'GET':
        lat = float(request.args.get('lat'))
        lng = float(request.args.get('lng'))
        position = Position(lat, lng)

        # regulation is to consider roads within 1000', but consider 2000' in
        # case of very busy highways
        road_distance = request.args.get('road_distance', 609.6)

        road_client = HighwaysClient()
        roads = road_client.get_unique_segments(position, road_distance)
        county = None
        growth_rate = None
        if roads:
            county = road_client.county
            growth_rate = road_client.county.get_growth_rate()

        rail_distance = request.args.get('rail_distance', 1828.8)

        rail_client = RailroadsClient()
        rails = rail_client.get_unique_segments(position, rail_distance)

        site = Site(position=position, roads=roads, rails=rails,
                    county=county, growth_rate=growth_rate)

    elif request.method == 'POST':
        site = SiteSchema().load(request.get_json()).data

    site.process()
    response = SiteSchema().dump(site).data
    return json.jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
