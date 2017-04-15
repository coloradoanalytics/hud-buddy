from marshmallow import Schema, fields, pre_load, post_load

from DNL import auto_speed_adjustment_factor, \
    heavy_truck_speed_adjustment_factor, future_aadt, medium_truck_count, \
    heavy_truck_count, auto_count, effective_auto_aadt, \
    effective_heavy_truck_aadt, night_time_adj, dnl_auto, dnl_heavy_truck, \
    dnl_sum

from locations import Point, PointSchema


class Segment:

    def __init__(self,
                 name,
                 measured_aadt,
                 measured_aadt_comb,
                 measured_aadt_year,
                 county_name,
                 speed_limit,
                 coordinates,
                 comparison_point=None,
                 county=None):

        self.name = name
        self.measured_aadt = measured_aadt
        self.measured_aadt_year = measured_aadt_year
        self.truck_percentage = (measured_aadt_comb / measured_aadt) * 100
        self.county_name = county
        self.speed_limit = speed_limit
        self.coordinates = coordinates
        self.auto_speed_adjustment_factor = auto_speed_adjustment_factor(
            speed_limit)
        self.heavy_truck_speed_adjustment_factor = heavy_truck_speed_adjustment_factor(
            speed_limit)

        if comparison_point:
            self.set_distance_and_closest_point(comparison_point)

        self.county = county

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

    @property
    def future_aadt(self):
        return future_aadt(
            self.county.future_population.population,
            self.county.current_population.population,
            self.measured_aadt
        )

    @property
    def medium_truck_count(self):
        return medium_truck_count(self.future_aadt)

    @property
    def heavy_truck_count(self):
        return heavy_truck_count(self.future_aadt, self.truck_percentage)

    @property
    def auto_count(self):
        return auto_count(
            self.future_aadt,
            self.heavy_truck_count,
            self.medium_truck_count
        )

    @property
    def effective_auto_aadt(self):
        return effective_auto_aadt(
            self.auto_count,
            self.medium_truck_count,
            self.auto_speed_adjustment_factor,
            night_time_adj()
        )

    @property
    def effective_heavy_truck_aadt(self):
        return effective_heavy_truck_aadt(
            self.heavy_truck_count,
            self.heavy_truck_speed_adjustment_factor,
            night_time_adj()
        )

    @property
    def auto_dnl(self):
        return dnl_auto(self.effective_auto_aadt, self.closest_distance)

    @property
    def heavy_truck_dnl(self):
        return dnl_heavy_truck(self.effective_heavy_truck_aadt,
                               self.closest_distance)

    @property
    def total_dnl(self):
        return dnl_sum([self.auto_dnl, self.heavy_truck_dnl])

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
    county_name = fields.Str(load_from='county')
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


class SegmentResponseSchema(Schema):
    name = fields.Str(dump_to='street_name')
    county = fields.Str()
    current_aadt = fields.Float()
    future_aadt = fields.Float()
    distance = fields.Float()
    truck_percentage = fields.Float()


class HighwaysResponseSchema(Schema):
    combined_aadt = fields.Float()
    segments = fields.Nested(SegmentResponseSchema,
                             many=True, load_from='segments')
