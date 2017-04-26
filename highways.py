import math
import numpy

from marshmallow import Schema, fields, pre_load, post_load

from DNL import dnl_sum

from locations import Position, PositionSchema, \
    PositionSchemaFromCIM, CountySchema


class Road:

    def __init__(self, *args, **kwargs):
        self.name = kwargs.get('name', None)

        self.positions = kwargs.get('positions', None)
        self.distance = kwargs.get('distance', None)
        self.county_name = kwargs.get('county_name', None)
        self.stop_sign_distance = kwargs.get('stop_sign_distance', 0)

        self.counted_adt = kwargs.get('counted_adt', None)
        self.counted_adt_year = kwargs.get('counted_adt_year', None)
        self.adt = kwargs.get('adt', None)
        self.adt_year = kwargs.get('adt_year', 2027)

        self.night_fraction_autos = kwargs.get('night_fraction_autos', 0.15)
        self.night_fraction_trucks = kwargs.get('night_fraction_trucks', 0.15)
        self.grade = kwargs.get('grade', 0.02)
        self.medium_trucks = kwargs.get('medium_trucks', 0.02)
        self.heavy_trucks = kwargs.get('heavy_trucks', 0.025)
        self.speed_autos = kwargs.get('speed_autos', 55)
        self.speed_trucks = kwargs.get('speed_trucks', self.speed_autos - 5)

        self.auto_saf = self.get_auto_saf()
        self.heavy_truck_saf = self.get_heavy_truck_saf()
        self.night_time_adj = self.get_night_time_adj()
        self.dnl = kwargs.get('dnl', None)

    def dnl_calc(self, effective_adt, type):
        type_offset = (54, 70)
        return math.ceil(
            4.34 * numpy.log(effective_adt) - 6.58 *
            numpy.log(self.distance) + type_offset[type]
        )

    @property
    def auto_dnl(self):
        return self.dnl_calc(self.effective_auto_adt, 0)

    @property
    def truck_dnl(self):
        return self.dnl_calc(self.effective_heavy_truck_adt, 1)

    def get_night_time_adj(self):
        return float(3.813) * self.night_fraction_autos + float(.425)

    def get_heavy_truck_saf(self):
        """
        Heavy truck speed adjustment factor
        """
        if self.speed_trucks < 50:
            return float(.81)
        else:
            return float(.0376) * self.speed_trucks - float(1.072)

    def get_auto_saf(self):
        """
        Auto speed adjustment factor
        """
        return math.pow(float(self.speed_autos), float(2.025)) * float(.0003)

    def get_distance(self, position):
        closest = None
        for p in self.positions:
            d = p.distance_from(position)
            if not closest or d < closest:
                closest = d
        return closest

    def get_adt(self):
        num_years = self.adt_year - self.counted_adt_year
        return self.counted_adt * (numpy.exp(self.growth_rate * num_years))

    def get_medium_truck_count(self):
        return self.adt * float(self.medium_trucks)

    def get_heavy_truck_count(self):
        return self.adt * float(self.heavy_trucks)

    @property
    def auto_count(self):
        return self.adt - self.get_heavy_truck_count() - self.get_medium_truck_count()

    @property
    def effective_auto_adt(self):
        return (self.auto_count + 10 * self.get_medium_truck_count() * self.auto_saf * self.night_time_adj)

    @property
    def effective_heavy_truck_adt(self):
        return (self.get_heavy_truck_count() *
                self.heavy_truck_saf *
                self.night_time_adj)

    def get_dnl(self):
        dnl = dnl_sum([self.auto_dnl, self.truck_dnl])
        return dnl


class RoadSchema(Schema):
    name = fields.Str()
    counted_adt = fields.Number()
    counted_adt_year = fields.Number()
    adt = fields.Number()
    adt_year = fields.Number()
    night_fraction_autos = fields.Float()
    night_fraction_trucks = fields.Float()
    distance = fields.Number()
    stop_sign_distance = fields.Number()
    grade = fields.Float()
    medium_trucks = fields.Float()
    heavy_trucks = fields.Float()
    speed_autos = fields.Number()
    speed_trucks = fields.Float()
    dnl = fields.Float(dump_only=True)

    @post_load
    def make_road(self, data):
        return Road(**data)


class RoadSchemaFromCIM(Schema):
    name = fields.Str(load_from='alias')
    positions = fields.Nested(PositionSchemaFromCIM, many=True)

    counted_adt = fields.Float(load_from='aadt')
    measured_aadt_comb = fields.Float(load_from='aadtcomb')
    heavy_trucks = fields.Float(load_from='heavy_trucks')
    counted_adt_year = fields.Number(load_from='aadtyr')
    county_name = fields.Str()
    speed_autos = fields.Float(load_from='speedlim')

    @pre_load
    def move_coordinates(self, data):
        """
        Pops the coordinate info from the
        API response so it can be loaded
        by the key `coordinates` above.
        """
        the_geom = data.pop('the_geom')
        data['positions'] = the_geom['coordinates']
        return data

    @pre_load
    def get_heavy_trucks(self, data):
        data['heavy_trucks'] = (
            float(data['aadtcomb']) / float(data['aadt']))
        return data

    @pre_load
    def clean_county_name(self, data):
        data['county_name'] = data['county'].split(' Co')[0]
        return data

    @post_load
    def make_road(self, data):
        """
        Creates the Road object from the
        API data.
        """
        return Road(**data)
