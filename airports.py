from marshmallow import Schema, fields, pre_load, post_load
from locations import PositionSchema, PositionSchemaFromCIM


class Airport:

    def __init__(self, *args, **kwargs):
        self.position = kwargs.get('position', None)
        self.airport_type = kwargs.get('airport_type', None)
        self.annual_ops = kwargs.get('annual_ops', 0)
        self.name = kwargs.get('name', "Unidentified Airport")
        self.dnl = kwargs.get('dnl', None)
        self.distance = kwargs.get('distance', None)

    def set_distance(self, position):
        self.distance = round(self.position.distance_from(position), 0)

    def get_dnl(self):
        return self.dnl


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
    # setting Meta.strict to True causes marshmallow to stop on a validation
    # error instead of defaulting to a dict

    class Meta:
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
