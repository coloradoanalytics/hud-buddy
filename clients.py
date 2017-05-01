import threading

import requests
from highways import RoadSchemaFromCIM
from railroads import RailroadSchemaFromCIM
from locations import County, CountyPopulationByAgeSchema, \
    CountyPopulationByAgeGroup


class CIMClient:

    base_url = 'https://data.colorado.gov/resource/{}.json'
    resource_id = None
    url = None
    schema_class = None

    session = requests.session()

    def __init__(self):
        self.url = self.base_url.format(self.resource_id)

    def get(self, payload, context=None):
        response = self.session.get(self.url, params=payload).json()
        schema = self.schema_class(many=self.many)
        schema.context = context
        return schema.load(response).data


class HighwaysClient(CIMClient):

    resource_id = 'phvc-rwei'
    schema_class = RoadSchemaFromCIM
    many = True
    roads = []

    def _get_county(self):
        """
        Performs an API request to get the county population data
        """
        if self.roads:
            county_name = self.roads[0].county_name
            year = self.roads[0].counted_adt_year

            current_client = PopulationsClient(
                county_name=county_name, year=year)
            future_client = PopulationsClient(
                county_name=county_name, year="2027")

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

        return None

    def _get_unique_by_name(self):
        names = set(r.name for r in self.roads)
        new_roads = []
        for name in names:
            roads = [r for r in self.roads if r.name == name]
            closest = min(roads, key=lambda x: x.distance)
            new_roads.append(closest)
        self.roads = new_roads

    def _remove_duplicates(self):
        new_roads = []
        adts = set()
        for road in self.roads:
            if road.counted_adt not in adts:
                new_roads.append(road)
                adts.add(road.counted_adt)
        self.roads = new_roads

    def get_segments(self, position, distance):
        payload = {"$where": "within_circle(the_geom, {}, {}, {})".format(
            position.lat, position.lng, distance)}

        self.roads = self.get(payload)

        county = self._get_county()
        growth_rate = county.get_growth_rate()

        for r in self.roads:
            r.growth_rate = growth_rate
            r.distance = r.get_distance(position)
            r.set_distances()

        self._get_unique_by_name()
        self._remove_duplicates()

        return self.roads


class PopulationsClient(CIMClient):

    resource_id = 'tv8u-hswn'
    schema_class = CountyPopulationByAgeSchema
    many = True

    def __init__(self, county_name, year):
        super().__init__()
        self.county_name = county_name
        self.year = year

    def get_populations(self):
        payload = {"county": self.county_name, "year": self.year}
        data = self.get(payload)
        self.populations = CountyPopulationByAgeGroup(populations=data)


class RailroadsClient(CIMClient):

    resource_id = '2tib-gtif'
    schema_class = RailroadSchemaFromCIM
    many = True

    def get_segments(self, position, distance):
        payload = {"$where": "within_circle(the_geom, {}, {}, {})".format(
            position.lat, position.lng, distance)}
        return self.get(payload)
