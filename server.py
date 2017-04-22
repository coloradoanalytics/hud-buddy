from flask import Flask, request, json, current_app
import json as jsn
import requests
import data
import DNL
import pprint
from highways import SegmentResponseSchema, HighwaysResponseSchema
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
    # return render_template('index.html')
    return current_app.send_static_file('html/index.html')


@app.route("/api/sites/")
def sites():
    # Get requested lat, lon and distance from query string
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    position = Position(lat, lon)

    distance = request.args.get('distance', 609.6)

    # Get highway data for requested location
    segments = data.get_highways(lat, lon, distance)

    site = Site(position=position, roads=segments)
    response = SiteSchema().dump(site).data

    return json.jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
