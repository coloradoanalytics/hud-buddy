from marshmallow import Schema, fields, pre_load, post_load

from .models import Auto, MediumTruck, HeavyTruck, Road
from locations.schemas import PositionSchemaFromCIM


class VehicleSchema(Schema):

    class Meta:
        strict = True

    # from parent road, used for input only
    distance = fields.Number(load_only=True)
    stop_sign_distance = fields.Number(allow_none=True, load_only=True)
    grade = fields.Number(allow_none=True, load_only=True)

    # specific to vehicle, input and output
    adt_fraction = fields.Float(required=True)
    speed = fields.Number(required=True)
    night_fraction = fields.Float(default=0.15)

    # always calculated, output only
    dnl = fields.Float(dump_only=True)


class AutoSchema(VehicleSchema):

    class Meta:
        strict = True

    adt_fraction = fields.Float(required=False, allow_none=True)

    @post_load
    def make_auto(self, data):
        return Auto(**data)


class MediumTruckSchema(VehicleSchema):

    class Meta:
        strict = True

    @post_load
    def make_medium_truck(self, data):
        return MediumTruck(**data)


class HeavyTruckSchema(VehicleSchema):

    class Meta:
        strict = True

    @post_load
    def make_heavy_truck(self, data):
        return HeavyTruck(**data)


class RoadSchema(Schema):

    class Meta:
        strict = True

    # required, always sent by client
    name = fields.Str()
    distance = fields.Integer()
    adt = fields.Integer()
    adt_year = fields.Integer()

    # optional
    stop_sign_distance = fields.Number(allow_none=True)
    grade = fields.Float(default=0.02)
    counted_adt = fields.Number(allow_none=True)
    counted_adt_year = fields.Number(allow_none=True)

    # nested objects
    auto = fields.Nested(AutoSchema)
    medium_truck = fields.Nested(MediumTruckSchema)
    heavy_truck = fields.Nested(HeavyTruckSchema)

    # always calculated, output only
    dnl = fields.Float(dump_only=True)

    @post_load
    def make_road(self, data):
        road = Road(**data)
        road.set_adts()
        return Road(**data)


class RoadSchemaFromCIM(Schema):

    class Meta:
        strict = True

    name = fields.Str(load_from='alias')
    positions = fields.Nested(PositionSchemaFromCIM, many=True)

    counted_adt = fields.Float(load_from='aadt')
    counted_adt_heavy_trucks = fields.Float(load_from='aadtcomb')
    counted_adt_year = fields.Integer(load_from='aadtyr')
    county_name = fields.Str()
    speed_autos = fields.Integer(load_from='speedlim')

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

    @pre_load
    def clean_county_name(self, data):
        """
        Remove 'Co' from the county name, so it matches
        the county names in the County Populations dataset.
        """
        data['county_name'] = data['county'].split(' Co')[0]
        return data

    @post_load
    def make_road(self, data):
        """
        Creates the Road object from the API data.
        """
        heavy_truck_fraction = round(
            data['counted_adt_heavy_trucks'] / data['counted_adt'], 4)

        # The API does not provide a medium truck count,
        # so we make a reasonable assumption
        medium_truck_fraction = 0.02

        auto_fraction = 1 - medium_truck_fraction - heavy_truck_fraction

        data['auto'] = Auto(
            adt_fraction=auto_fraction,
            speed=data['speed_autos']
        )
        data['medium_truck'] = MediumTruck(
            adt_fraction=medium_truck_fraction,
            speed=data['speed_autos'] - 5
        )
        data['heavy_truck'] = HeavyTruck(
            adt_fraction=heavy_truck_fraction,
            speed=data['speed_autos'] - 5
        )

        return Road(**data)
