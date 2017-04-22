from marshmallow import Schema, fields, pre_load, post_load
from utils import haversine


class Position:

    def __init__(self, latitude, longitude):
        self.latitude = latitude
        self.longitude = longitude

    def distance_from(self, position):
        return haversine(self.longitude, self.latitude,
                         position.longitude, position.latitude)


class PositionSchema(Schema):
    latitude = fields.Float()
    longitude = fields.Float()

    @pre_load
    def move_positions(self, data):
        return dict(latitude=data[1], longitude=data[0])

    @post_load
    def make_position(self, data):
        return Position(**data)


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
