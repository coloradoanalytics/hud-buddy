import unittest

from locations import Position


class DistanceFromTestCase(unittest.TestCase):

    def test_distance_from(self):
        """
        Test that the great circle distance between
        two points is being calculated correctly.
        """
        p1 = Position(lat=39.1212, lng=-104.012)
        p2 = Position(lat=39.1222, lng=-104.014)

        expected = 673.5  # distance in feet
        # source: http://www.onlineconversion.com/map_greatcircle_distance.htm

        distance = p1.distance_from(p2)
        self.assertAlmostEqual(distance, expected, 1)


if __name__ == '__main__':
    unittest.main()
