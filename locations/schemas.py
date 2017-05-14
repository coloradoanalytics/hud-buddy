from marshmallow import Schema, fields, pre_load, post_load

from .models import Position, CountyPopulationByAge


class PositionSchema(Schema):

    class Meta:
        strict = True

    lat = fields.Float(allow_none=True, allow_null=True)
    lng = fields.Float(allow_none=True, allow_null=True)

    @post_load
    def make_position(self, data):
        return Position(**data)


class PositionSchemaFromCIM(PositionSchema):

    class Meta:
        strict = True

    @pre_load
    def move_positions(self, data):
        return dict(lat=data[1], lng=data[0])


class PopulationSchema(Schema):

    class Meta:
        strict = True

    population = fields.Number(allow_none=True, allow_null=True)
    year = fields.Number(allow_none=True, allow_null=True)
    county = fields.Str(allow_none=True, allow_null=True)


class CountySchema(Schema):

    class Meta:
        strict = True

    name = fields.Str(allow_null=True, allow_none=True)
    current_population = fields.Nested(PopulationSchema)
    future_population = fields.Nested(PopulationSchema)


class CountyPopulationByAgeSchema(Schema):

    class Meta:
        strict = True

    name = fields.Str(load_from='county')
    population = fields.Float(load_from='totalpopulation')
    age = fields.Number()
    year = fields.Number()

    @post_load
    def make_position(self, data):
        return CountyPopulationByAge(**data)
