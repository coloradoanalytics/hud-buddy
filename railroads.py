from marshmallow import Schema, fields, pre_load, post_load

from locations import Position, PositionSchema, PositionSchemaFromCIM


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

    @property
    def name(self):
        return "{} / {} / {}".format(self.railroad, self.branch, self.division)

    def get_distance(self, position):
        closest = None
        for p in self.positions:
            d = p.distance_from(position)
            if not closest or d < closest:
                closest = d
        return closest


class RailSchema(Schema):
    name = fields.Str()

    railroad = fields.Str()
    branch = fields.Str()
    division = fields.Str()
    subdivision = fields.Str()
    rr_class = fields.Str()
    rrowner_1 = fields.Str()
    status = fields.Str()

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
    positions = fields.Nested(PositionSchemaFromCIM, many=True)
    railroad = fields.Str()
    branch = fields.Str()
    division = fields.Str()
    subdivision = fields.Str(load_from='subdivisio')
    rr_class = fields.Str()
    rrowner_1 = fields.Str()
    status = fields.Str()

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

    @post_load
    def make_rail(self, data):
        """
        Creates the Road object from the
        API data.
        """
        return Rail(**data)
