import requests
from highways import SegmentSchema, SegmentGroup


class CIMClient:

    base_url = 'https://data.colorado.gov/resource/{}.json'
    resource_id = None

    session = requests.session()

    def url(self):
        return self.base_url.format(self.resource_id)

    def get(self, payload):
        return self.session.get(self.url(), params=payload).json()


class HighwaysClient(CIMClient):

    resource_id = 'phvc-rwei'

    def get_segments(self, point, distance):
        payload = {"$where": "within_circle(the_geom, {}, {}, {})".format(
            point.latitude, point.longitude, distance)}
        response = self.get(payload)
        segments = SegmentSchema(many=True).load(response).data
        return SegmentGroup(segments=segments, point=point)
