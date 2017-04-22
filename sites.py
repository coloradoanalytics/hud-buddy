from marshmallow import Schema, fields, pre_load, post_load

import data
import DNL
from locations import PositionSchema, CountySchema
from highways import SegmentResponseSchema


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

        if self.roads:
            if not self.county:
                self.county = self.get_county()

            for road in self.roads:
                road.county = self.county

            if not self.combined_dnl:
                self.combined_dnl = self.get_combined_dnl()

    def get_combined_dnl(self):
        return DNL.dnl_sum([road.total_dnl for road in self.roads])

    def get_county(self):
        """
        Performs an API request to get the county population data
        """
        county_name = self.roads[0].county_name
        year = self.roads[0].measured_aadt_year
        return data.get_county(county_name=county_name, year=year)


class SiteSchema(Schema):
    position = fields.Nested(PositionSchema)
    roads = fields.Nested(SegmentResponseSchema, many=True)
    county = fields.Nested(CountySchema)
    name = fields.Str()
    growth_rate = fields.Float()
    combined_dnl = fields.Float()

    @post_load
    def make_site(self, data):
        return Site(**data)
