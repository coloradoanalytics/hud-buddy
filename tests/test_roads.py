from tests.common import CustomTestCase

from locations import Position
from highways import Road


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


if __name__ == '__main__':
    unittest.main()
