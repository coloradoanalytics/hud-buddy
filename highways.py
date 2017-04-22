from marshmallow import Schema, fields, pre_load, post_load

from DNL import auto_speed_adjustment_factor, \
    heavy_truck_speed_adjustment_factor, future_aadt, medium_truck_count, \
    heavy_truck_count, auto_count, effective_auto_aadt, \
    effective_heavy_truck_aadt, night_time_adj, dnl_auto, dnl_heavy_truck, \
    dnl_sum

from locations import Position, PositionSchema, CountySchema


class Segment:

    def __init__(self,
                 name,
                 measured_aadt,
                 measured_aadt_comb,
                 measured_aadt_year,
                 county_name,
                 speed_limit,
                 coordinates=None,
                 comparison_position=None,
                 county=None):

        self.name = name
        self.measured_aadt = measured_aadt
        self.measured_aadt_year = measured_aadt_year
        self.truck_percentage = (measured_aadt_comb / measured_aadt) * 100
        self.county_name = county_name
        self.speed_limit = speed_limit
        self.coordinates = coordinates
        self.auto_speed_adjustment_factor = auto_speed_adjustment_factor(
            speed_limit)
        self.heavy_truck_speed_adjustment_factor = heavy_truck_speed_adjustment_factor(
            speed_limit)

        if comparison_position:
            self.set_distance_and_closest_position(comparison_position)

        self.county = county

    def set_distance_and_closest_position(self, position):
        closest_distance = None
        closest_position = None

        for p in self.coordinates:
            distance = p.distance_from(position)
            if not closest_distance or distance < closest_distance:
                closest_distance = distance
                closest_position = p

        self.closest_distance = closest_distance
        self.closest_position = closest_position

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
    """
    Class for managing a list of Segment objects. Particularly
    useful for Segments that have come from the Highways API
    and need to be de-duped.
    """

    def __init__(self, segments, position):
        self.segments = segments
        [s.set_distance_and_closest_position(position) for s in segments]
        self.position = position

        self.get_unique_by_name()

    def closest(self, segments):
        return min(segments, key=lambda x: min(
            ([self.position.distance_from(p) for p in x.coordinates])
        ))

    def get_duplicate(self, segment, segments):
        """
        Returns True if either:

            the name of any element in `segments`
            is fully contained in the name of `segment`

            or

            the name of `segment` is fully contained
            in the name of any element in `segments`

        AND

            The two segments have the same measured aadt
        """
        current_aadts = {s.name: s.measured_aadt for s in segments}

        for name, aadt in current_aadts.items():
            if segment.measured_aadt == aadt:
                return True
        return False

    def get_unique_by_name(self):
        names = set(s.name for s in self.segments)
        new_segments = []
        for name in names:
            segments = [s for s in self.segments if s.name == name]
            closest_segment = self.closest(segments)
            duplicate = self.get_duplicate(closest_segment, new_segments)
            if not duplicate:
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
        PositionSchema, many=True, load_from='coordinates')
    comparison_position = fields.Nested(PositionSchema)

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

    @pre_load
    def clean_county_name(self, data):
        data['county'] = data['county'].split(' Co')[0]
        return data

    @post_load
    def make_segment(self, data):
        """
        Creates the Segment object from the
        API data.
        """
        return Segment(**data)


class UserDefinedSegment(Schema):

    name = fields.Str()
    measured_aadt = fields.Float()
    measured_aadt_year = fields.Number(missing=2017)
    measured_aadt_comb = fields.Float()
    county_name = fields.Str()
    speed_limit = fields.Number()
    coordinates = coordinates = fields.Nested(PositionSchema)

    @post_load
    def make_segment(self, data):
        return Segment(**data)


class SegmentResponseSchema(Schema):
    name = fields.Str(dump_to='street_name')
    county = fields.Nested(CountySchema)
    current_aadt = fields.Float()
    future_aadt = fields.Float()
    distance = fields.Float()
    truck_percentage = fields.Float()


class HighwaysResponseSchema(Schema):
    combined_aadt = fields.Float()
    segments = fields.Nested(SegmentResponseSchema,
                             many=True, load_from='segments')
