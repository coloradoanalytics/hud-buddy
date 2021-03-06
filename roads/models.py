import math

from common.utils import dnl_sum


class VehicleType:
    """
    Base class for storing information about the
    average daily traffic of a given type of vehicle.

    Args:
        adt (decimal): The total expected future daily traffic count
        speed (int): The average speed, in mph
        night_fraction (decimal): The percentage of traffic that occurs
                                  at night, as a decimal
        distance (decimal): The distance in feet to the site being analyzed
        stop_sign_distance (decimal): The distance in feet to the stop sign
        grade (decimal): The incline of the road, as a decimal
    """

    def __init__(self, *args, **kwargs):
        # specific to this VehicleType
        self.adt = kwargs.get('adt', None)
        self.adt_fraction = kwargs.get('adt_fraction', None)
        self.speed = kwargs.get('speed', None)
        self.night_fraction = kwargs.get('night_fraction', 0.15)
        self.day_fraction = 1 - self.night_fraction

        # shared across the whole Site object
        self.distance = kwargs.get('distance', None)
        self.stop_sign_distance = kwargs.get('stop_sign_distance', None)

        self.grade = kwargs.get('grade', 0)

    def get_eadt(self):
        if not self.stop_sign_distance:
            return self.adt
        return self.adt * (.1 + (.9 * (self.stop_sign_distance) / 600))

    def get_dnl_sub(self):
        eadt = self.get_eadt()
        return eadt * (self.day_fraction + (10 * self.night_fraction))

    def get_ae_result(self):
        log_1 = math.log10(self.speed)
        log_2 = math.log10(self.distance)
        return 64.6 + 20 * log_1 - 15 * log_2

    def get_log_dnl_sub(self):
        dnl_sub = self.get_dnl_sub()
        return math.log10(dnl_sub)

    def get_dnl_result(self):
        ae_result = self.get_ae_result()
        log_dnl_sub = self.get_log_dnl_sub()
        return ae_result + 10 * log_dnl_sub - 49.4

    @property
    def dnl(self):
        return self.get_dnl_result()


class Auto(VehicleType):
    pass


class MediumTruck(VehicleType):

    def get_eadt(self):
        if not self.stop_sign_distance:
            return self.adt
        return 10 * self.adt * (0.1 + (0.9 * self.stop_sign_distance / 600))


class HeavyTruck(VehicleType):

    def get_eadt(self):
        if not self.stop_sign_distance:
            return self.adt
        else:
            if self.adt <= 1200:
                factor = 1.8
            elif self.adt > 1200 and self.adt <= 2400:
                factor = 2.0
            elif self.adt > 2400 and self.adt <= 4800:
                factor = 2.3
            elif self.adt > 4800 and self.adt <= 9600:
                factor = 2.8
            elif self.adt > 9600 and self.adt <= 19200:
                factor = 3.8
            else:
                factor = 4.5
            return self.adt * factor

    def get_ae_result(self):
        log_1 = math.log10(self.speed)
        log_2 = math.log10(self.distance)
        if self.speed <= 50:
            ae_result = 114.5 - 15 * log_2
        else:
            ae_result = 80.5 + 20 * log_1 - 15 * log_2
        return ae_result

    def get_num_gaf(self):
        # HUD formula actually uses "grade" in a literal sense, like 2% means
        # 2, not 0.02
        return (self.grade * 100) ** 0.5

    def get_dnl_result(self):
        ae_result = self.get_ae_result()
        log_dnl_sub = self.get_log_dnl_sub()
        if self.grade > 0:
            dnl_result = (ae_result + 10 * log_dnl_sub -
                          49.4 + self.get_num_gaf())
        else:
            dnl_result = (ae_result + 10 * log_dnl_sub - 49.4)
        return dnl_result


class Road:

    def __init__(self, *args, **kwargs):
        self.name = kwargs.get('name', None)

        self.positions = kwargs.get('positions', None)
        self.distance = kwargs.get('distance', None)
        self.county_name = kwargs.get('county_name', None)
        self.stop_sign_distance = kwargs.get('stop_sign_distance', None)
        self.grade = kwargs.get('grade', 0.02)

        self.counted_adt = kwargs.get('counted_adt', None)
        self.counted_adt_trucks = kwargs.get('counted_adt_trucks', None)
        self.counted_adt_year = kwargs.get('counted_adt_year', None)
        self.adt = kwargs.get('adt', None)
        self.adt_year = kwargs.get('adt_year', 2027)

        # VehicleType objects
        self.auto = kwargs.get('auto', Auto())
        self.medium_truck = kwargs.get('medium_truck', MediumTruck())
        self.heavy_truck = kwargs.get('heavy_truck', HeavyTruck())

        self.dnl = kwargs.get('dnl', None)

    def set_distances(self):
        """
        Assign the current Road's distance, stop_sign_distance
        and grade to each of its child VehicleTypes, so they
        can use them in their DNL calculations.
        """
        keys = ['auto', 'medium_truck', 'heavy_truck']
        for k in keys:
            obj = getattr(self, k)
            if obj:
                obj.stop_sign_distance = self.stop_sign_distance
                obj.distance = self.distance
                obj.grade = self.grade

    def set_adts(self):
        """
        Turn the given truck fractions into ADT counts
        """
        self.medium_truck.adt = self.adt * self.medium_truck.adt_fraction
        self.heavy_truck.adt = self.adt * self.heavy_truck.adt_fraction
        self.auto.adt = self.adt - self.medium_truck.adt - self.heavy_truck.adt

    def get_distance(self, position):
        """
        Compares each of this roads positions
        to the given position, and returns
        the shortest distance.
        """
        closest = None
        for p in self.positions:
            d = p.distance_from(position)
            if not closest or d < closest:
                closest = d
        return closest

    def get_adt(self):
        """
        Return either the existing ADT, or calculate one based
        on the counted adt and growth rate, in the case of a Road
        that has come from CIM without a future ADT.
        """
        if self.adt:
            return self.adt
        num_years = self.adt_year - self.counted_adt_year
        return self.counted_adt * (math.exp(self.growth_rate * num_years))

    def get_dnl(self):
        """
        Return the total DNL for this road, which is the sum
        of its auto, medium truck and heavy truck dnl's
        """
        return dnl_sum(
            [self.auto.dnl, self.medium_truck.dnl, self.heavy_truck.dnl])

    def get_auto_adt_fraction(self):
        return(
            self.auto.adt /
            (self.auto.adt + self.medium_truck.adt + self.heavy_truck.adt)
        )

    def get_medium_truck_adt_fraction(self):
        return(
            self.medium_truck.adt /
            (self.auto.adt + self.medium_truck.adt + self.heavy_truck.adt)
        )

    def get_heavy_truck_adt_fraction(self):
        return(
            self.heavy_truck.adt /
            (self.auto.adt + self.medium_truck.adt + self.heavy_truck.adt)
        )
