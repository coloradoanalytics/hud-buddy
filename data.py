import requests
from math import radians, cos, sin, asin, sqrt, pow
import DNL

def get_highways(lat, lon, distance):
    s = requests.session()
    
    highway_url = "https://data.colorado.gov/resource/phvc-rwei.json"
    payload = {"$where": "within_circle(the_geom, {}, {}, {})".format(
        lat, lon, distance)}

    highways = s.get(highway_url, params=payload).json()
    highway_names = set([h['alias'] for h in highways])

    final_segments = []

    for name in highway_names:
        segments = [h for h in highways if h['alias'] == name]
	
        seg = min(segments, key=lambda x: min(([haversine(lon, lat, c[0], c[1]) for c in x['the_geom']['coordinates']])))
        seg_distances = [haversine(lon, lat, x[0], x[1]) for x in seg['the_geom']['coordinates']]        
        seg_distance = min(seg_distances)
        truck_percentage = (float(seg['aadtcomb']) / float(seg['aadt'])) * 100
        closest_segment = {
            'name': seg['alias'],
            'aadt': seg['aadt'],
            'year': seg['aadtyr'],
            'county': seg['county'],
            'speed_limit': seg['speedlim'],
            'auto_speed_adjustment_factor': DNL.auto_speed_adjustment_factor(float(seg['speedlim'])),
            'heavy_truck_speed_adjustment_factor': DNL.heavy_truck_speed_adjustment_factor(float(seg['speedlim'])),
            'truck_percentage': truck_percentage,
            'distance':seg_distance
        }
        final_segments.append(closest_segment)
    return final_segments

def get_population():
    s = requests.session()
    
    population_url = "https://data.colorado.gov/resource/tv8u-hswn.json"
    population_payload = {"county": "Denver", "year": "2014"}
    population_res = s.get(population_url, params=population_payload)
    counties = population_res.json()
    current_pop = sum([float(c['totalpopulation']) for c in counties])
    population_payload = {"county": "Denver", "year": "2027"}
    population_res = s.get(population_url, params=population_payload)
    counties = population_res.json()
    future_pop = sum([float(c['totalpopulation']) for c in counties])
    return current_pop, future_pop

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

