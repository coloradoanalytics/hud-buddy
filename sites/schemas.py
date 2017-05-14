from marshmallow import Schema, fields, post_load

from .models import Site
from locations.schemas import PositionSchema, CountySchema
from roads.schemas import RoadSchema
from railroads.schemas import RailSchema
from airports.schemas import AirportSchema


class SiteSchema(Schema):

    class Meta:
        strict = True

    position = fields.Nested(PositionSchema)
    roads = fields.Nested(RoadSchema, many=True)
    rails = fields.Nested(RailSchema, many=True)
    airports = fields.Nested(AirportSchema, many=True)
    county = fields.Nested(CountySchema, allow_none=True)
    name = fields.Str(allow_none=True)
    growth_rate = fields.Float(allow_none=True, places=2)
    combined_dnl = fields.Float(dump_only=True)
    user_name = fields.Str(allow_none=True)

    @post_load
    def make_site(self, data):
        site = Site(**data)
        for r in site.roads:
            r.set_distances()
        return site
