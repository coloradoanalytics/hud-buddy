import math

from marshmallow import Schema, fields, pre_load, post_load

from utils import dnl_sum
from locations.schemas import PositionSchemaFromCIM


class Rail:

    def __init__(self, *args, **kwargs):
        self.positions = kwargs.get('positions', None)
        self.distance = kwargs.get('distance', None)
        self.railroad = kwargs.get('railroad', 'Railroad')
        self.branch = kwargs.get('branch', None)
        self.division = kwargs.get('division', None)
        self.subdivision = kwargs.get('subdivision', None)
        self.rr_class = kwargs.get('rr_class', '1')
        self.rrowner_1 = kwargs.get('rrowner_1', None)
        self.status = kwargs.get('status', None)

        self.diesel = kwargs.get('diesel', True)
        self.speed = kwargs.get('speed', 30)
        self.engines_per_train = kwargs.get('engines_per_train', 2)
        self.cars_per_train = kwargs.get('cars_per_train', 50)
        self.ato = kwargs.get('ato', 0)
        self.night_fraction = kwargs.get('night_fraction', 0.15)
        self.horns = kwargs.get('horns', False)
        self.bolted_tracks = kwargs.get('bolted_tracks', False)

        self.dnl = kwargs.get('dnl', None)

        self.name = kwargs.get('name', self.get_default_name())

    def get_default_name(self):
        return "{} / {} / {}".format(self.railroad, self.branch, self.division)

    def get_distance(self, position):
        closest = None
        for p in self.positions:
            d = p.distance_from(position)
            if not closest or d < closest:
                closest = d
        return closest

    def get_aato_e(self):
        if self.horns:
            return self.ato * 10
        return self.ato

    def get_aato_c(self):
        if self.bolted_tracks:
            return self.ato * 4
        return self.ato

    def get_dnl_sub_e(self):
        if self.engines_per_train and self.engines_per_train > 0:
            return self.get_aato_e() * (
                1 - self.night_fraction + 10 * self.night_fraction
            )
        return 1

    def get_dnl_sub_c(self):
        if self.cars_per_train and self.cars_per_train > 0:
            return self.get_aato_c() * (
                1 - self.night_fraction + 10 * self.night_fraction
            )
        return 1

    def get_ae_result_e(self):
        if self.engines_per_train and self.engines_per_train > 0:
            return (
                141.7 - 10 * math.log10(self.speed) +
                10 * math.log10(self.engines_per_train) -
                15 * math.log10(self.distance)
            )
        return 0

    def get_ae_result_c(self):
        if self.cars_per_train and self.cars_per_train > 0:
            return (71.4 + 20 * math.log10(self.speed) +
                    10 * math.log10(self.cars_per_train) -
                    15 * math.log10(self.distance)
                    )
        return 0

    def get_dnl_result_e(self):
        return (self.get_ae_result_e() +
                10 * math.log10(self.get_dnl_sub_e()) - 49.4)

    def get_dnl_result_c(self):
        return (self.get_ae_result_c() +
                10 * math.log10(self.get_dnl_sub_c()) - 49.4)

    def get_dnl_diesel(self):
        return round(dnl_sum(
            [self.get_dnl_result_e(), self.get_dnl_result_c()]
        ), 1)

    def get_aato_r(self):
        if self.horns:
            return self.ato * 100
        return self.ato

    def get_aato_tot(self):
        # transferred from HUD website and appears to ignore
        # horns with non-bolted tracks.
        # kept this way for consistency with HUD tool.
        if self.bolted_tracks:
            return self.get_aato_r() + 4 * self.ato
        return 2 * self.ato

    def get_dnl_sub(self):
        return self.get_aato_tot() * (
            1 - self.night_fraction + 10 * self.night_fraction
        )

    def get_ae_result(self):
        return (
            71.4 + 20 * math.log10(self.speed) + 10 * math.log10(
                self.engines_per_train + self.cars_per_train + 1
            ) - 15 * math.log10(self.distance)
        )

    def get_dnl_electric(self):
        return round(
            self.get_ae_result() + 10 * math.log10(self.get_dnl_sub()) - 49.4,
            1
        )

    def get_dnl(self):
        if self.ato < 1:
            return 0
        if self.diesel:
            return self.get_dnl_diesel()
        return self.get_dnl_electric()


class RailSchema(Schema):

    class Meta:
        strict = True

    name = fields.Str()

    railroad = fields.Str(allow_null=True, allow_none=True)
    branch = fields.Str(allow_null=True, allow_none=True)
    division = fields.Str(allow_null=True, allow_none=True)
    subdivision = fields.Str(allow_null=True, allow_none=True)
    rr_class = fields.Str(allow_null=True, allow_none=True)
    rrowner_1 = fields.Str(allow_null=True, allow_none=True)
    status = fields.Str(allow_null=True, allow_none=True)

    diesel = fields.Bool()
    distance = fields.Integer()
    speed = fields.Number()
    engines_per_train = fields.Number()
    cars_per_train = fields.Number()
    ato = fields.Number()
    night_fraction = fields.Float()
    horns = fields.Bool()
    bolted_tracks = fields.Bool()
    dnl = fields.Float(dump_only=True)

    @post_load
    def make_rail(self, data):
        return Rail(**data)


class RailroadSchemaFromCIM(Schema):

    class Meta:
        strict = True

    positions = fields.Nested(PositionSchemaFromCIM, many=True)
    railroad = fields.Str(allow_null=True, allow_none=True)
    branch = fields.Str(allow_null=True, allow_none=True)
    division = fields.Str(allow_null=True, allow_none=True)
    subdivision = fields.Str(load_from='subdivisio',
                             allow_null=True, allow_none=True)
    rr_class = fields.Str(allow_null=True, allow_none=True)
    rrowner_1 = fields.Str(allow_null=True, allow_none=True)
    status = fields.Str(allow_null=True, allow_none=True)

    @pre_load
    def move_coordinates(self, data):
        """
        Pops the coordinate info from the
        API response so it can be loaded
        by the key `coordinates` above.
        """
        the_geom = data.pop('the_geom')

        # Use this to compensate for the May 4th shift in the dataset's
        # structure, which may or may not be permanent
        data['positions'] = the_geom['coordinates'][0]

        # use this if they change it back
        # data['positions'] = the_geom['coordinates']

        return data

    @post_load
    def make_rail(self, data):
        """
        Creates the Road object from the
        API data.
        """
        return Rail(**data)
