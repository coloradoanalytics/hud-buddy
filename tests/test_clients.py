from tests.common import CustomTestCase

from clients import HighwaysClient
from roads.models import Road
from locations.models import Position


class UniqueTestCase(CustomTestCase):

    def test_get_unique_by_name(self):
        """
        Assert that only the closest road with a given name
        is included in the site after calling `get_unique_by_name`
        """
        r1 = Road(name="I-25", positions=[Position(lat=39.1212, lng=-104.012)])
        r2 = Road(name="I-25", positions=[Position(lat=39.1200, lng=-104.000)])

        r3 = Road(name="I-70", positions=[Position(lat=39.1212, lng=-104.012)])
        r4 = Road(name="I-70", positions=[Position(lat=39.1200, lng=-104.000)])

        client = HighwaysClient()
        client.roads = [r1, r2, r3, r4]
        client.position = Position(lat=39.1213, lng=-104.013)

        client._get_unique_by_name()
        self.assertListsEqual(client.roads, [r1, r3])

    def test_remove_duplicates(self):
        """
        Assert that roads with duplicate ADT's are not included
        in the site after calling `remove_duplicates`
        """

        r1 = Road(counted_adt=12345)
        r2 = Road(counted_adt=12345)
        r3 = Road(counted_adt=23456)

        client = HighwaysClient()
        client.roads = [r1, r2, r3]

        client._remove_duplicates()

        self.assertListsEqual(client.roads, [r1, r3])
