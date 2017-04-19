from flask import Flask, request, json, current_app
import json as jsn
import requests
import data
import DNL
import pprint
from highways import SegmentResponseSchema, HighwaysResponseSchema

#use custom Flask delimiters to prevent collision with Vue
#https://github.com/yymm/flask-vuejs
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
    #return render_template('index.html')
    return current_app.send_static_file('html/index.html')


@app.route("/api/highways/")
def highways():
    # Get requested lat, lon and distance from query string
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    distance = request.args.get('distance', 609.6)

    # Get highway data for requested location
    segments = data.get_highways(lat, lon, distance)

    response = {'combined_dnl': 0.0, 'segments': []}

    if segments:
        # Get population projections
        county = data.get_county(county_name=segments[0].county_name,
                                 year=segments[0].measured_aadt_year)

        segment_dnls = []

        for seg in segments:
            seg.county = county

            response_object = SegmentResponseSchema().dump(seg).data
            response['segments'].append(response_object)

            segment_dnls.append(seg.total_dnl)

        if segment_dnls:
            response['combined_dnl'] = DNL.dnl_sum(segment_dnls)

    with open('response.txt', 'w+') as outfid:
        jsn.dump(response, outfid)

    return json.jsonify(response)


if __name__ == "__main__":
    app.run()
