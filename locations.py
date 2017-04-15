from marshmallow import Schema, fields, pre_load, post_load
from utils import haversine


class Point:

    def __init__(self, latitude, longitude):
        self.latitude = latitude
        self.longitude = longitude

    def distance_from(self, point):
        return haversine(self.longitude, self.latitude,
                         point.longitude, point.latitude)


class PointSchema(Schema):
    latitude = fields.Float()
    longitude = fields.Float()

    @pre_load
    def move_points(self, data):
        return dict(latitude=data[1], longitude=data[0])

    @post_load
    def make_point(self, data):
        return Point(**data)
