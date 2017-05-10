from marshmallow import Schema, fields, pre_load, post_load
from utils import haversine, growth_rate


class Position:

    def __init__(self, lat, lng):
        self.lat = lat
        self.lng = lng

    def distance_from(self, position):
        return haversine(self.lng, self.lat,
                         position.lng, position.lat)


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
        strict=True

    @pre_load
    def move_positions(self, data):
        return dict(lat=data[1], lng=data[0])


class Population:

    def __init__(self, population, year, county):
        self.population = population
        self.year = year
        self.county = county


class PopulationSchema(Schema):
    class Meta:
        strict = True

    population = fields.Number(allow_none=True, allow_null=True)
    year = fields.Number(allow_none=True, allow_null=True)
    county = fields.Str(allow_none=True, allow_null=True)


class County:

    def __init__(self, current_population, future_population, name):
        self.current_population = current_population
        self.future_population = future_population
        self.name = name

    def get_growth_rate(self):
        current_pop = self.current_population.population
        future_pop = self.future_population.population
        num_years = self.future_population.year - self.current_population.year
        return growth_rate(current_pop, future_pop, num_years)


class CountySchema(Schema):
    class Meta:
        strict = True

    name = fields.Str(allow_null=True, allow_none=True)
    current_population = fields.Nested(PopulationSchema)
    future_population = fields.Nested(PopulationSchema)
    # current_population = fields.Number(allow_null=True, allow_none=True)
    # future_population = fields.Number(allow_null=True, allow_none=True)

    ##############REMOVE#############3333
    # @pre_load
    # def county_schema_reload(self, data):
    #     print("current_population", data["current_population"])
    #     return data


class CountyPopulationByAge:

    def __init__(self, name, population, age, year):
        self.name = name
        self.population = population
        self.age = age
        self.year = year


class CountyPopulationByAgeGroup:

    def __init__(self, populations):
        self.populations = populations

    def get_total_population(self):
        population = sum(p.population for p in self.populations)
        return Population(population=population,
                          year=self.populations[0].year,
                          county=self.populations[0].name)


class CountyPopulationByAgeSchema(Schema):
    class Meta:
        strict=True

    name = fields.Str(load_from='county')
    population = fields.Float(load_from='totalpopulation')
    age = fields.Number()
    year = fields.Number()

    @post_load
    def make_position(self, data):
        return CountyPopulationByAge(**data)
