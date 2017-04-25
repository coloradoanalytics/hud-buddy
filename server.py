from flask import Flask, request, json, current_app

import requests

import data
import DNL
from clients import HighwaysClient
from locations import Position
from sites import Site, SiteSchema, SiteSchemaFromUser

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

        distance = request.args.get('distance', 609.6)

        c = HighwaysClient()
        roads = c.get_segments(position, distance)

        site = Site(position=position, roads=roads)
        site.process()

    elif request.method == 'POST':
        site = SiteSchemaFromUser().load(request.get_json()).data

    response = SiteSchema().dump(site).data
    return json.jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
