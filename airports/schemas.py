from marshmallow import Schema, fields, pre_load, post_load

from .models import Airport
from locations.schemas import PositionSchema, PositionSchemaFromCIM


class AirportSchema(Schema):

    class Meta:
        strict = True

    position = fields.Nested(PositionSchema, allow_null=True, allow_none=True)
    airport_type = fields.Str(allow_null=True)
    annual_ops = fields.Number(allow_null=True, allow_none=True)
    name = fields.Str()
    distance = fields.Number(allow_null=True)
    dnl = fields.Float(allow_null=True, allow_none=True)

    @post_load
    def make_airport(self, data):
        return Airport(**data)


class AirportSchemaFromCIM(Schema):

    class Meta:
        # setting Meta.strict to True causes marshmallow
        # to stop on a validation error instead of defaulting to a dict.
        strict = True

    position = fields.Nested(PositionSchemaFromCIM)
    aircraftop = fields.Str()
    airport_type = fields.Str(load_from="airporttyp")
    annual_ops = fields.Number(load_from="annualops_")
    name = fields.Str()

    @pre_load
    def get_position(self, data):
        the_geom = data.pop('the_geom')
        data['position'] = the_geom['coordinates']
        return data

    @post_load
    def make_airport(self, data):
        return Airport(**data)
