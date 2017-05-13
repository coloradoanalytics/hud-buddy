from common.utils import haversine, growth_rate


class Position:
    """
    Represents a latitude/longitude pair
    """

    def __init__(self, lat, lng):
        self.lat = lat
        self.lng = lng

    def distance_from(self, position):
        return haversine(self.lng, self.lat,
                         position.lng, position.lat)


class Population:
    """
    Stores the population count of a given county in a given year.
    """

    def __init__(self, population, year, county):
        self.population = population
        self.year = year
        self.county = county


class County:
    """
    A county, along with its current and future populations.
    """

    def __init__(self, current_population, future_population, name):
        self.current_population = current_population
        self.future_population = future_population
        self.name = name

    def get_growth_rate(self):
        current_pop = self.current_population.population
        future_pop = self.future_population.population
        num_years = self.future_population.year - self.current_population.year
        return growth_rate(current_pop, future_pop, num_years)


class CountyPopulationByAge:
    """
    Used to model the information returned by the CIM endpoint
    for population by county.
    """

    def __init__(self, name, population, age, year):
        self.name = name
        self.population = population
        self.age = age
        self.year = year


class CountyPopulationByAgeGroup:
    """
    Groups together multiple CountyPopulationByAge objects
    and combines their population counts into a single
    Population object.
    """

    def __init__(self, populations):
        self.populations = populations

    def get_total_population(self):
        population = sum(p.population for p in self.populations)
        return Population(population=population,
                          year=self.populations[0].year,
                          county=self.populations[0].name)
