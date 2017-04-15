from marshmallow import Schema, fields, pre_load, post_load

from DNL import auto_speed_adjustment_factor, heavy_truck_speed_adjustment_factor
from locations import Point, PointSchema


class County:
    pass


class Segment:

    def __init__(self,
                 name,
                 measured_aadt,
                 measured_aadt_comb,
                 measured_aadt_year,
                 county,
                 speed_limit,
                 coordinates,
                 comparison_point=None):

        self.name = name
        self.measured_aadt = measured_aadt
        self.measured_aadt_year = measured_aadt_year
        self.truck_percentage = (measured_aadt_comb / measured_aadt) * 100
        self.county = county
        self.speed_limit = speed_limit
        self.coordinates = coordinates
        self.auto_speed_adjustment_factor = auto_speed_adjustment_factor(
            speed_limit)
        self.heavy_truck_speed_adjustment_factor = heavy_truck_speed_adjustment_factor(
            speed_limit)

        if comparison_point:
            self.set_distance_and_closest_point(comparison_point)

    def set_distance_and_closest_point(self, point):
        closest_distance = None
        closest_point = None

        for p in self.coordinates:
            distance = p.distance_from(point)
            if not closest_distance or distance < closest_distance:
                closest_distance = distance
                closest_point = p

        self.closest_distance = closest_distance
        self.closest_point = closest_point

        return True

    def __repr__(self):
        return '<Segment(name={self.name!r})>'.format(self=self)


class SegmentGroup:

    def __init__(self, segments, point):
        self.segments = segments
        [s.set_distance_and_closest_point(point) for s in segments]
        self.point = point

        self.get_unique_by_name()

    def closest(self, segments):
        return min(segments, key=lambda x: min(
            ([self.point.distance_from(p) for p in x.coordinates])
        ))

    def get_unique_by_name(self):
        names = set(s.name for s in self.segments)
        new_segments = []
        for name in names:
            segments = [s for s in self.segments if s.name == name]
            closest_segment = self.closest(segments)
            new_segments.append(closest_segment)
        self.segments = new_segments
        return new_segments


class SegmentSchema(Schema):
    name = fields.Str(load_from='alias')
    measured_aadt = fields.Float(load_from='aadt')
    measured_aadt_comb = fields.Float(load_from='aadtcomb')
    measured_aadt_year = fields.Number(load_from='aadtyr')
    county = fields.Str()
    speed_limit = fields.Float(load_from='speedlim')
    coordinates = fields.Nested(
        PointSchema, many=True, load_from='coordinates')
    comparison_point = fields.Nested(PointSchema)

    @pre_load
    def move_coordinates(self, data):
        """
        Pops the coordinate info from the
        API response so it can be loaded
        by the key `coordinates` above.
        """
        the_geom = data.pop('the_geom')
        data['coordinates'] = the_geom['coordinates']
        return data

    @post_load
    def make_segment(self, data):
        """
        Creates the Segment object from the
        API data.
        """
        return Segment(**data)
