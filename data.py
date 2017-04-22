import requests
from math import pow
import DNL
from highways import Segment, SegmentGroup, SegmentSchema
from locations import Position, County
from clients import HighwaysClient, PopulationsClient


def get_highways(lat, lon, distance):
    c = HighwaysClient()
    position = Position(lat, lon)

    segment_group = c.get_segments(position, distance)

    return segment_group.segments


def get_county(county_name="Denver", year="2014"):
    c = PopulationsClient()

    current_population_group = c.get_populations(
        county_name=county_name, year=year)
    current_population = current_population_group.get_total_population()

    future_population_group = c.get_populations(
        county_name=county_name, year="2027")
    future_population = future_population_group.get_total_population()

    county = County(current_population=current_population,
                    future_population=future_population,
                    name=county_name)

    return county
