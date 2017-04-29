import math
import numpy

from marshmallow import Schema, fields, pre_load, post_load

from DNL import dnl_sum

from locations import Position, PositionSchema, \
    PositionSchemaFromCIM, CountySchema


class VehicleType:
    """
    Base class for storing information about the
    average daily traffic of a given type of vehicle.

    Args:
        adt (decimal): The total expected future daily traffic count
        speed (int): The average speed, in mph
        night_fraction (decimal): The percentage of traffic that occurs
                                  at night, as a decimal
        distance (decimal): The distance in feet to the site being analyzed
        stop_sign_distance (decimal): The distance in feet to the stop sign
        grade (decimal): The incline of the road, as a decimal
    """

    def __init__(self, *args, **kwargs):
        # specific to this VehicleType
        self.adt = kwargs.get('adt', 0)
        self.speed = kwargs.get('speed', 50)
        self.night_fraction = kwargs.get('night_fraction', .10)
        self.day_fraction = 1 - self.night_fraction

        # shared across the whole Site object
        self.distance = kwargs.get('distance', None)
        self.stop_sign_distance = kwargs.get('stop_sign_distance', None)

        self.grade = kwargs.get('grade', 0)
        self.num_gaf = math.pow(self.grade, .5)

    def get_eadt(self):
        if not self.stop_sign_distance:
            return self.adt
        return self.adt * (.1 + (.9 * (self.stop_sign_distance) / 600))

    def get_dnl_sub(self):
        eadt = self.get_eadt()
        return eadt * (self.day_fraction + (10 * self.night_fraction))

    def get_ae_result(self):
        log_1 = numpy.log10(self.speed)
        log_2 = numpy.log10(self.distance)
        return 64.6 + 20 * log_1 - 15 * log_2

    def get_log_dnl_sub(self):
        dnl_sub = self.get_dnl_sub()
        return numpy.log10(dnl_sub)

    def get_dnl_result(self):
        ae_result = self.get_ae_result()
        log_dnl_sub = self.get_log_dnl_sub()
        return ae_result + 10 * log_dnl_sub - 49.4

    @property
    def dnl(self):
        return self.get_dnl_result()


class Auto(VehicleType):
    pass


class VehicleSchema(Schema):
    adt = fields.Number()
    speed = fields.Number()
    night_fraction = fields.Float()
    distance = fields.Number()
    stop_sign_distance = fields.Number(allow_none=True)
    grade = fields.Number(allow_none=True)
    dnl = fields.Float(dump_only=True)


class AutoSchema(VehicleSchema):

    @post_load
    def make_auto(self, data):
        return Auto(**data)


class MediumTruck(VehicleType):

    def get_eadt(self):
        if not self.stop_sign_distance:
            return self.adt
        return 10 * self.adt * (0.1 + (0.9 * self.stop_sign_distance / 600))


class MediumTruckSchema(VehicleSchema):

    @post_load
    def make_medium_truck(self, data):
        return MediumTruck(**data)


class HeavyTruck(VehicleType):

    def get_eadt(self):
        if not self.stop_sign_distance:
            return self.adt
        else:
            if self.adt <= 1200:
                factor = 1.8
            elif self.adt > 1200 and self.adt <= 2400:
                factor = 2.0
            elif self.adt > 2400 and self.adt <= 4800:
                factor = 2.3
            elif self.adt > 4800 and self.adt <= 9600:
                factor = 2.8
            elif self.adt > 9600 and self.adt <= 19200:
                factor = 3.8
            else:
                factor = 4.5
            return self.adt * factor

    def get_ae_result(self):
        log_1 = numpy.log10(self.speed)
        log_2 = numpy.log10(self.distance)
        if self.speed <= 50:
            ae_result = 114.5 - 15 * log_2
        else:
            ae_result = 80.5 + 20 * log_1 - 15 * log_2
        return ae_result

    def get_dnl_result(self):
        ae_result = self.get_ae_result()
        log_dnl_sub = self.get_log_dnl_sub()
        if self.grade > 0:
            dnl_result = (ae_result + 10 * log_dnl_sub - 49.4 + self.num_gaf)
        else:
            dnl_result = (ae_result + 10 * log_dnl_sub - 49.4)
        return dnl_result


class HeavyTruckSchema(VehicleSchema):

    @post_load
    def make_heavy_truck(self, data):
        return HeavyTruck(**data)


class Road:
    """
    Args:
        name (str)
        positions (:obj: `list` of :obj: Position)
        distance (float)
        county_name (str)
        stop_sign_distance (float)
    """

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

        # VehicleType objects
        self.auto = kwargs.get('auto', None)
        self.medium_truck = kwargs.get('medium_truck', None)
        self.heavy_truck = kwargs.get('heavy_truck', None)

        self.dnl = kwargs.get('dnl', None)

    def get_distance(self, position):
        """
        Compares each of this roads positions
        to the given position, and returns
        the shortest distance.
        """
        closest = None
        for p in self.positions:
            d = p.distance_from(position)
            if not closest or d < closest:
                closest = d
        return closest

    def get_adt(self):
        num_years = self.adt_year - self.counted_adt_year
        return self.counted_adt * (numpy.exp(self.growth_rate * num_years))

    def get_dnl(self):
        return dnl_sum(
            [self.auto.dnl, self.medium_truck.dnl, self.heavy_truck.dnl])


class RoadSchema(Schema):
    name = fields.Str()
    distance = fields.Number()
    counted_adt = fields.Number()
    counted_adt_year = fields.Number()
    adt = fields.Number()
    adt_year = fields.Number()
    stop_sign_distance = fields.Number()
    grade = fields.Float()

    auto = fields.Nested(AutoSchema)
    medium_truck = fields.Nested(MediumTruckSchema)
    heavy_truck = fields.Nested(HeavyTruckSchema)

    dnl = fields.Float(dump_only=True)

    @post_load
    def make_road(self, data):
        keys = ['auto', 'medium_truck', 'heavy_truck']
        for k in keys:
            obj = data.get(k)
            if obj:
                obj.stop_sign_distance = data.get('stop_sign_distance')
                obj.distance = data.get('distance')
                obj.grade = data.get('grade')
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
