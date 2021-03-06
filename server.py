import os
import uuid

from flask import Flask, request, json, current_app, make_response

from roads.clients import HighwaysClient
from railroads.clients import RailroadsClient
from airports.clients import AirportsClient

from locations.models import Position
from sites.models import Site
from sites.schemas import SiteSchema


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
    """
    Route that serves the home page.
    """
    return current_app.send_static_file('html/index.html')


@app.route("/api/sites/", methods=['GET', 'POST'])
def sites():
    """
    API route that takes a latitude and longitude
    and responds with a fully computed Site object.
    """
    if request.method == 'GET':
        lat = float(request.args.get('lat'))
        lng = float(request.args.get('lng'))
        position = Position(lat, lng)

        # find roads within 1500 ft
        road_distance = request.args.get('road_distance', 457.2)
        # find railways within 4500 ft
        rail_distance = request.args.get('rail_distance', 1371.6)
        # find airports within 15 miles
        airport_distance = request.args.get('airport-distance', 14140.2)

        road_client = HighwaysClient()
        roads = road_client.get_unique_segments(position, road_distance)
        county = None
        growth_rate = .015
        if roads:
            county = road_client.county
            growth_rate = road_client.county.get_growth_rate()

        rail_client = RailroadsClient()
        rails = rail_client.get_unique_segments(position, rail_distance)

        airports_client = AirportsClient()
        airports = airports_client.get_airports(position, airport_distance)
        if airports:
            for a in airports:
                a.set_distance(position)

        site = Site(position=position, roads=roads, rails=rails,
                    county=county, growth_rate=growth_rate, airports=airports)

    elif request.method == 'POST':
        site = SiteSchema().load(request.get_json()).data

    site.process()
    response = SiteSchema().dump(site).data
    return json.jsonify(response)


@app.route("/api/reports/", methods=['POST'])
def reports():
    """
    API route that takes a Site object and returns a PDF file
    with the results of the calculations.
    """

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

    # set disposition to 'inline' to open in new browser tab, set to
    # 'attachment' to download immediately
    response.headers["Content-Disposition"] = "inline; filename=NAL.pdf"

    # clean generated files then serve response
    os.remove(filename + '.pdf')
    os.remove(filename + '.tex')
    return response


# run the app in debug mode locally
if __name__ == "__main__":
    app.run(debug=True)
