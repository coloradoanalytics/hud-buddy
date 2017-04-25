from marshmallow import Schema, fields, pre_load, post_load

from DNL import auto_speed_adjustment_factor, \
    heavy_truck_speed_adjustment_factor, future_aadt, medium_truck_count, \
    heavy_truck_count, auto_count, effective_auto_aadt, \
    effective_heavy_truck_aadt, night_time_adj, dnl_auto, dnl_heavy_truck, \
    dnl_sum, growth_rate, future_aadt_new

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
        self.speed_trucks = kwargs.get('speed_trucks', 50)

        self.auto_speed_adjustment_factor = auto_speed_adjustment_factor(
            self.speed_autos)
        self.heavy_truck_speed_adjustment_factor = heavy_truck_speed_adjustment_factor(
            self.speed_trucks)

        self.dnl = kwargs.get('dnl', None)

    def get_distance(self, position):
        closest = None
        for p in self.positions:
            d = p.distance_from(position)
            if not closest or d < closest:
                closest = d
        return closest

    def get_adt(self):
        num_years = self.adt_year - self.counted_adt_year
        return future_aadt_new(self.counted_adt,
                               self.growth_rate, num_years)

    def get_medium_trucks(self):
        return medium_truck_count(self.adt)

    def get_heavy_trucks(self):
        return heavy_truck_count(self.adt)

    @property
    def auto_count(self):
        return auto_count(
            self.adt,
            self.heavy_trucks,
            self.medium_trucks
        )

    @property
    def effective_auto_aadt(self):
        return effective_auto_aadt(
            self.auto_count,
            self.medium_trucks,
            self.auto_speed_adjustment_factor,
            night_time_adj()
        )

    @property
    def effective_heavy_truck_aadt(self):
        return effective_heavy_truck_aadt(
            self.heavy_trucks,
            self.heavy_truck_speed_adjustment_factor,
            night_time_adj()
        )

    @property
    def auto_dnl(self):
        return dnl_auto(self.effective_auto_aadt, self.distance)

    @property
    def heavy_truck_dnl(self):
        return dnl_heavy_truck(self.effective_heavy_truck_aadt,
                               self.distance)

    def get_dnl(self):
        dnl = dnl_sum([self.auto_dnl, self.heavy_truck_dnl])
        return dnl


class RoadSchema(Schema):
    """
    {
      road_name: "I-70",
      counted_adt: 14000,
      counted_adt_year: 2015,
      adt: 16555,
      adt_year: 2027,
      night_fraction_autos: 0.15,
      night_fraction_trucks: 0.15,
      road_distance: 235,
      stop_sign_distance: 0,
      grade: 0.02,
      medium_trucks: 0.02,
      heavy_trucks: 0.025,
      speed_autos: 55,
      speed_trucks: 50,
      road_dnl: 62.5
    }
    """
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
    dnl = fields.Float()

    @post_load
    def make_road(self, data):
        return Road(**data)


class RoadSchemaFromCIM(Schema):
    name = fields.Str(load_from='alias')
    positions = fields.Nested(PositionSchemaFromCIM, many=True)

    counted_adt = fields.Float(load_from='aadt')
    measured_aadt_comb = fields.Float(load_from='aadtcomb')
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
