from marshmallow import Schema, fields, pre_load, post_load
from utils import haversine
from DNL import growth_rate


class Position:

    def __init__(self, lat, lng):
        self.lat = lat
        self.lng = lng

    def distance_from(self, position):
        return haversine(self.lng, self.lat,
                         position.lng, position.lat)


class PositionSchema(Schema):
    lat = fields.Float()
    lng = fields.Float()

    @post_load
    def make_position(self, data):
        return Position(**data)


class PositionSchemaFromCIM(PositionSchema):

    @pre_load
    def move_positions(self, data):
        return dict(lat=data[1], lng=data[0])


class Population:

    def __init__(self, population, year, county):
        self.population = population
        self.year = year
        self.county = county


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
    name = fields.Str()
    current_population = fields.Number()
    future_population = fields.Number()


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
    name = fields.Str(load_from='county')
    population = fields.Float(load_from='totalpopulation')
    age = fields.Number()
    year = fields.Number()

    @post_load
    def make_position(self, data):
        return CountyPopulationByAge(**data)
