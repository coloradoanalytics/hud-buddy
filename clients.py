import requests
from highways import SegmentSchema, SegmentGroup
from locations import CountyPopulationByAgeSchema, CountyPopulationByAgeGroup


class CIMClient:

    base_url = 'https://data.colorado.gov/resource/{}.json'
    resource_id = None
    url = None
    schema_class = None

    session = requests.session()

    def __init__(self):
        self.url = self.base_url.format(self.resource_id)

    def get(self, payload):
        response = self.session.get(self.url, params=payload).json()
        return self.schema_class(many=self.many).load(response).data


class HighwaysClient(CIMClient):

    resource_id = 'phvc-rwei'
    schema_class = SegmentSchema
    many = True

    def get_payload():
        pass

    def get_segments(self, position, distance):
        payload = {"$where": "within_circle(the_geom, {}, {}, {})".format(
            position.latitude, position.longitude, distance)}
        data = self.get(payload)
        return SegmentGroup(segments=data, position=position)


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
