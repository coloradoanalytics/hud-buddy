from math import pow
import threading

import requests

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
    current_client = PopulationsClient(county_name=county_name, year=year)
    future_client = PopulationsClient(county_name=county_name, year="2027")

    threads = []
    current_pop_thread = threading.Thread(
        target=current_client.get_populations())
    threads.append(current_pop_thread)
    future_pop_thread = threading.Thread(
        target=future_client.get_populations())
    threads.append(future_pop_thread)

    for t in threads:
        t.start()
    for t in threads:
        t.join()

    current_population = current_client.populations.get_total_population()
    future_population = future_client.populations.get_total_population()

    county = County(current_population=current_population,
                    future_population=future_population,
                    name=county_name)

    return county
