from flask import Flask, request, json, render_template
import json as jsn
import requests
import data
import DNL
import pprint
from highways import SegmentResponseSchema, HighwaysResponseSchema

app = Flask(__name__)


@app.route("/")
def home():
    return render_template('index.html')


@app.route("/api/highways/")
def highways():
    # Get requested lat, lon and distance from query string
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    distance = request.args.get('distance', 304.8)

    # Get highway data for requested location
    segments = data.get_highways(lat, lon, distance)
    county_names = set([s.county for s in segments])

    # Get population projections
    county = data.get_county()

    segment_dnls = []

    response = {'combined_dnl': 0.0, 'segments': []}

    # For each road segment, calculate Total DNL
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
