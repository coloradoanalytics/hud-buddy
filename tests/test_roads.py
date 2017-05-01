from tests.common import CustomTestCase

from locations import Position
from highways import Road, Auto, MediumTruck, HeavyTruck


class DistanceTestCase(CustomTestCase):

    def test_get_closest(self):
        """
        Assert that the distance of the closer of two points
        is returned.
        """
        # distance = .73
        p1 = Position(lat=39.456789, lng=-104.1234567)

        # distance = 1.46
        p2 = Position(lat=39.456783, lng=-104.1234563)

        comp = Position(lat=39.456787, lng=-104.1234568)
        expected = .73

        road = Road(positions=[p1, p2])
        distance = road.get_distance(comp)

        self.assertAlmostEqual(distance, expected, 2)


class AutoDNLTestCase(CustomTestCase):

    def test_auto_dnl(self):
        auto = Auto(
            adt=25000,
            speed=45,
            distance=500,
            stop_sign_distance=100,
            grade=2,
            night_fraction=.15
        )
        self.assertAlmostEqual(auto.dnl, 49.4, 1)

    def test_auto_dnl_no_stop_sign(self):
        auto = Auto(
            adt=150000,
            speed=50,
            distance=100,
            night_fraction=.05
        )
        self.assertAlmostEqual(auto.dnl, 72.6, 1)


class MediumTruckDNLTestCase(CustomTestCase):

    def test_medium_truck_dnl(self):
        medium_truck = MediumTruck(
            adt=100,
            speed=45,
            distance=100,
            night_fraction=.05
        )
        self.assertAlmostEqual(medium_truck.dnl, 39.9, 1)

    def test_medium_truck_dnl_2(self):
        medium_truck = MediumTruck(
            adt=3000,
            speed=75,
            night_fraction=.25,
            distance=750,
            stop_sign_distance=250
        )
        self.assertAlmostEqual(medium_truck.dnl, 56.2, 1)

    def test_medium_truck_dnl_3(self):
        medium_truck = MediumTruck(
            distance=100,
            adt=100,
            speed=45,
            night_fraction=.05
        )
        self.assertAlmostEqual(medium_truck.dnl, 39.9, 1)


class HeavyTruckDNLTestCase(CustomTestCase):

    def test_heavy_truck_dnl(self):
        heavy_truck = HeavyTruck(
            distance=100,
            speed=75,
            adt=5600,
            night_fraction=.25
        )
        self.assertAlmostEqual(heavy_truck.dnl, 81.2, 1)

    def test_heavy_truck_dnl_2(self):
        heavy_truck = HeavyTruck(
            distance=500,
            stop_sign_distance=100,
            speed=45,
            adt=500,
            night_fraction=.15,
            grade=2
        )
        self.assertAlmostEqual(heavy_truck.dnl, 59.3, 1)


class CombinedDNLTestCase(CustomTestCase):

    def setUp(self):
        auto = Auto(
            distance=100,
            stop_sign_distance=None,
            speed=50,
            adt=150000,
            night_fraction=.05
        )
        medium_truck = MediumTruck(
            distance=100,
            stop_sign_distance=None,
            speed=45,
            adt=100,
            night_fraction=.05
        )
        heavy_truck = HeavyTruck(
            distance=100,
            speed=75,
            adt=5600,
            night_fraction=.25,
            grade=0
        )

        self.road = Road(
            auto=auto,
            medium_truck=medium_truck,
            heavy_truck=heavy_truck
        )

    def test_combined_dnl(self):
        dnl = self.road.get_dnl()
        self.assertAlmostEqual(dnl, 82, 1)
