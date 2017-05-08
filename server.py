from flask import Flask, request, json, current_app, make_response, send_file

import requests
import os

from clients import HighwaysClient, RailroadsClient
from locations import Position
from sites import Site, SiteSchema
import uuid

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


@app.route("/api/reports/", methods=['POST'])
def reports():
    # turn the string in request.form['site_json'] into a site object
    site = SiteSchema().loads(request.form['site_json']).data

    # random file name to prevent collisions between concurrent users
    filename = str(uuid.uuid4())

    # generate a report file using methods on the site object
    site.generate_report(filename)

    # open completed report file into memory and prepare response
    file = open(filename + '.pdf', 'r+b').read()
    response = make_response(file)
    response.headers["Content-Type"] = "application/pdf"
    
    # set disposition to 'inline' to open in new browser tab, set to 'attachment' to download immediately
    response.headers["Content-Disposition"] = "inline; filename=NAL.pdf"

    # clean generated files then serve response
    os.remove(filename + '.pdf')
    os.remove(filename + '.tex')
    return response
    
    #return send_file(filename + '.pdf', as_attachment=True, attachment_filename='NAL.pdf')

if __name__ == "__main__":
    app.run(debug=True)
