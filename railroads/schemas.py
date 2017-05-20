from marshmallow import Schema, fields, pre_load, post_load

from .models import Rail
from locations.schemas import PositionSchemaFromCIM


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
        Creates the Rail object from the
        API data.
        """
        return Rail(**data)
