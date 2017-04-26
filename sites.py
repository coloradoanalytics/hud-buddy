from marshmallow import Schema, fields, pre_load, post_load

import data
import DNL
from locations import PositionSchema, CountySchema
from highways import RoadSchema, RoadSchemaFromCIM


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
        Fill in missing data for a
        site that was filled with
        data from the API.
        """
        self.county = self.get_county()
        self.get_unique_by_name()
        self.remove_duplicates()
        self.set_growth_rates()
        self.set_distances()
        self.set_adts()
        self.set_dnls()
        self.combined_dnl = self.get_combined_dnl()

    def get_unique_by_name(self):
        names = set(r.name for r in self.roads)
        new_roads = []
        for name in names:
            roads = [r for r in self.roads if r.name == name]
            closest = min(roads, key=lambda x: x.get_distance(self.position))
            new_roads.append(closest)
        self.roads = new_roads

    def remove_duplicates(self):
        new_roads = []
        adts = set()
        for road in self.roads:
            if road.counted_adt not in adts:
                new_roads.append(road)
                adts.add(road.counted_adt)
        self.roads = new_roads

    def get_combined_dnl(self):
        if self.roads:
            return DNL.dnl_sum([road.dnl for road in self.roads])
        return None

    def get_county(self):
        """
        Performs an API request to get the county population data
        """
        if self.roads:
            county_name = self.roads[0].county_name
            year = self.roads[0].counted_adt_year
            return data.get_county(county_name=county_name, year=year)
        return None

    def set_growth_rates(self):
        if self.county and not self.growth_rate:
            self.growth_rate = self.county.get_growth_rate()
        if self.growth_rate:
            for road in self.roads:
                road.growth_rate = self.growth_rate

    def set_distances(self):
        for road in self.roads:
            road.distance = road.get_distance(self.position)

    def set_adts(self):
        for road in self.roads:
            road.adt = road.get_adt()

    def set_dnls(self):
        for road in self.roads:
            road.dnl = road.get_dnl()


class SiteSchema(Schema):
    position = fields.Nested(PositionSchema)
    roads = fields.Nested(RoadSchema, many=True)
    county = fields.Nested(CountySchema)
    name = fields.Str()
    growth_rate = fields.Float()
    combined_dnl = fields.Float(dump_only=True)

    @post_load
    def make_site(self, data):
        return Site(**data)
