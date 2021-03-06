from tests.custom import CustomTestCase

from locations.models import Position


class DistanceFromTestCase(CustomTestCase):

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
