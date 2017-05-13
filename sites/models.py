import math

from utils import dnl_sum
import report


class Site:
    """
    A location on earth defined by latitude and longitude,
    with associated information relevant to DNL calculations,
    such as highway segments, rails, and county data.

    The object might be populated from segments/rails/county data
    from the external APIs, or from information that the
    client submits.
    """

    def __init__(self, *args, **kwargs):
        self.position = kwargs.get('position', None)
        self.roads = kwargs.get('roads', [])
        self.rails = kwargs.get('rails', [])
        self.airports = kwargs.get('airports', [])
        self.county = kwargs.get('county', None)
        self.name = kwargs.get('name', 'NAL')
        self.growth_rate = kwargs.get('growth_rate', None)
        self.combined_dnl = kwargs.get('combined_dnl', None)
        self.user_name = kwargs.get('user_name', None)

    def process(self):
        """
        Calculate the missing ADT and DNL values for this site.
        """
        self.set_adts()
        self.set_dnls()
        self.combined_dnl = self.get_combined_dnl()

    def get_combined_dnl(self):
        energy = 0
        for road in self.roads:
            if road.get_dnl() is not None:
                energy += 10 ** (road.get_dnl() / 10)
            else:
                return None

        for rail in self.rails:
            if rail.get_dnl() is not None:
                energy += 10 ** (rail.get_dnl() / 10)
            else:
                return None

        for airport in self.airports:
            if airport.dnl is not None:
                energy += 10 ** (airport.dnl / 10)
            else:
                return None

        if energy == 0:
            return None

        return round(10 * math.log10(energy), 1)

    def set_adts(self):
        for road in self.roads:
            road.adt = road.get_adt()
            road.set_adts()

    def set_dnls(self):
        for road in self.roads:
            road.dnl = road.get_dnl()
        for rail in self.rails:
            rail.dnl = rail.get_dnl()

    def generate_report(self, filename):
        report.generate_report(self, filename)

    def get_airports_dnl(self):
        dnl_list = list()
        for a in self.airports:
            dnl_list.append(a.get_dnl())
        return dnl_sum(dnl_list)

    def get_roads_dnl(self):
        dnl_list = list()
        for road in self.roads:
            dnl_list.append(road.get_dnl())
        return dnl_sum(dnl_list)

    def get_rails_dnl(self):
        dnl_list = list()
        for rail in self.rails:
            dnl_list.append(rail.get_dnl())
        return dnl_sum(dnl_list)

    def get_hud_status(self):
        dnl = self.get_combined_dnl()
        if dnl <= 65:
            return 'Acceptable'
        elif dnl > 65 and dnl <= 75:
            return 'Normally Unacceptable'
        else:
            return 'Unacceptable'
