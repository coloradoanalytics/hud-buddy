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
    segments = data.getHighways(lat, lon, distance)
    county_names = set([s['county'] for s in segments])

    #Get population projections
    current_pop, future_pop = data.getPopulation()

    #Calculate night time adjustment
    nighttime_adj = DNL.nightTimeAdj() 

    response = []
    #For each road segment, calculate Total DNL
    for seg in segments:
        response_object = {}
        future_aadt = DNL.futureAadt(future_pop, current_pop, seg['aadt']) 
        medium_truck_count = DNL.mediumTruckCount(future_aadt) 
        heavy_truck_count = DNL.heavyTruckCount(future_aadt, seg['truck_percentage']) 
        auto_count = DNL.autoCount(future_aadt, heavy_truck_count, medium_truck_count)
        auto_speed_adjustment_factor = DNL.autoSpeedAdjustmentFactor(float(seg['speed_limit']))
        heavy_truck_speed_adjustment_factor = DNL.heavyTruckSpeedAdjustmentFactor(float(seg['speed_limit']))
        effective_auto_aadt = DNL.effectiveAutoAadt(auto_count, medium_truck_count, auto_speed_adjustment_factor, nighttime_adj)
        effective_heavy_truck_aadt = DNL.effectiveHeavyTruckAadt(heavy_truck_count, heavy_truck_speed_adjustment_factor, nighttime_adj)
        auto_dnl = DNL.dnlAuto(effective_auto_aadt, distance)
        heavy_truck_dnl = DNL.dnlHeavyTruck(effective_heavy_truck_aadt, distance)
        total_dnl = DNL.dnlSum(auto_dnl, heavy_truck_dnl)
        response_object['street_name'] = seg['name']
        response_object['county'] = seg['county']
        response_object['current_aadt'] = seg['aadt']
        response_object['future_aadt'] = str(int(future_aadt))
        response_object['total_dnl'] = str(total_dnl)
        response.append(response_object)

    return json.jsonify(response)



if __name__ == "__main__":
    app.run()
