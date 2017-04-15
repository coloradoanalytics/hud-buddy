import requests
from math import pow
import DNL
from highways import Segment, SegmentGroup, SegmentSchema
from locations import Point
from clients import HighwaysClient


def get_highways(lat, lon, distance):
    c = HighwaysClient()
    point = Point(lat, lon)

    segment_group = c.get_segments(point, distance)

    return segment_group.segments


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
