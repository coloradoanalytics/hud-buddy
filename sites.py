from marshmallow import Schema, fields, pre_load, post_load

from utils import dnl_sum
from locations import PositionSchema, CountySchema
from highways import RoadSchema, RoadSchemaFromCIM
from railroads import RailSchema, RailroadSchemaFromCIM


class Site:
    """
    A location on earth defined by latitude and longitude,
    with associated information relevant to DNL calculations,
    such as highway segments, rails, and county data.

    The object might be populated from segments/rails/county data
    from the external APIs, or from information that the
    client submits.
    """

    def __init__(self, position, *args, **kwargs):
        self.position = position

        self.roads = kwargs.get('roads', [])
        self.rails = kwargs.get('rails', [])
        self.airports = kwargs.get('airports', [])
        self.county = kwargs.get('county', None)
        self.name = kwargs.get('name', None)
        self.growth_rate = kwargs.get('growth_rate', None)
        self.combined_dnl = kwargs.get('combined_dnl', None)

    def process(self):
        """
        Calculate the missing ADT and DNL values for this site.
        """
        self.set_adts()
        self.set_dnls()
        self.combined_dnl = self.get_combined_dnl()

    def get_combined_dnl(self):
        if self.roads:
            return dnl_sum([road.dnl for road in self.roads])
        return None

    def set_adts(self):
        for road in self.roads:
            road.adt = road.get_adt()
            road.set_adts()

    def set_dnls(self):
        for road in self.roads:
            road.dnl = road.get_dnl()


class SiteSchema(Schema):
    position = fields.Nested(PositionSchema)
    roads = fields.Nested(RoadSchema, many=True)
    rails = fields.Nested(RailSchema, many=True)
    county = fields.Nested(CountySchema, allow_none=True)
    name = fields.Str(allow_none=True)
    growth_rate = fields.Decimal(allow_none=True, places=2)
    combined_dnl = fields.Float(dump_only=True)

    @post_load
    def make_site(self, data):
        site = Site(**data)
        for r in site.roads:
            r.set_distances()
        return site
