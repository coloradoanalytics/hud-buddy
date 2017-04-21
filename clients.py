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

    def get_segments(self, point, distance):
        payload = {"$where": "within_circle(the_geom, {}, {}, {})".format(
            point.latitude, point.longitude, distance)}
        data = self.get(payload)
        return SegmentGroup(segments=data, point=point)


class PopulationsClient(CIMClient):

    resource_id = 'tv8u-hswn'
    schema_class = CountyPopulationByAgeSchema
    many = True

    def get_populations(self, county_name="Denver", year="2014"):
        payload = {"county": county_name, "year": year}
        data = self.get(payload)
        return CountyPopulationByAgeGroup(populations=data)