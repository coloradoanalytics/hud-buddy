from math import radians, cos, sin, asin, sqrt, pow
from flask import Flask, request, json, render_template
import requests
import data
import DNL
app = Flask(__name__)

@app.route("/")
def home():
    return render_template('index.html')


@app.route("/api/highways/")
def highways():
    #Get requested lat, lon and distance from query string
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    distance = request.args.get('distance', 304.8)
    
    #Get highway data for requested location
    segments = data.get_highways(lat, lon, distance)
    county_names = set([s['county'] for s in segments])

    #Get population projections
    current_pop, future_pop = data.get_population()

    #Calculate night time adjustment
    nighttime_adj = DNL.night_time_adj() 

    response = {'combined_dnl':0.0, 'segments':[]}
    segment_dnls = []
    #For each road segment, calculate Total DNL
    for seg in segments:
        response_object = {}
        future_aadt = DNL.future_aadt(future_pop, current_pop, seg['aadt']) 
        medium_truck_count = DNL.medium_truck_count(future_aadt) 
        heavy_truck_count = DNL.heavy_truck_count(future_aadt, seg['truck_percentage']) 
        auto_count = DNL.auto_count(future_aadt, heavy_truck_count, medium_truck_count)
        auto_speed_adjustment_factor = DNL.auto_speed_adjustment_factor(float(seg['speed_limit']))
        heavy_truck_speed_adjustment_factor = DNL.heavy_truck_speed_adjustment_factor(float(seg['speed_limit']))
        effective_auto_aadt = DNL.effective_auto_aadt(auto_count, medium_truck_count, auto_speed_adjustment_factor, nighttime_adj)
        effective_heavy_truck_aadt = DNL.effective_heavy_truck_aadt(heavy_truck_count, heavy_truck_speed_adjustment_factor, nighttime_adj)
        auto_dnl = DNL.dnl_auto(effective_auto_aadt, seg['distance'])
        heavy_truck_dnl = DNL.dnl_heavy_truck(effective_heavy_truck_aadt, seg['distance'])
        segment_dnls.append(DNL.dnl_sum([auto_dnl, heavy_truck_dnl]))
        response_object['street_name'] = seg['name']
        response_object['county'] = seg['county']
        response_object['current_aadt'] = seg['aadt']
        response_object['future_aadt'] = str(int(future_aadt))
        response_object['distance'] = seg['distance']
        response_object['truck_percentage'] = seg['truck_percentage']
        response['segments'].append(response_object)

    response['combined_dnl'] = DNL.dnl_sum(segment_dnls)
    return json.jsonify(response)



if __name__ == "__main__":
    app.run()
