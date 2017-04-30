from tests.common import CustomTestCase

from locations import Position, County, Population
from highways import Road
from sites import Site


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

        site = Site(roads=[r1, r2, r3, r4],
                    position=Position(lat=39.1213, lng=-104.013))
        site.get_unique_by_name()
        self.assertListsEqual(site.roads, [r1, r3])

    def test_remove_duplicates(self):
        """
        Assert that roads with duplicate ADT's are not included
        in the site after calling `remove_duplicates`
        """

        r1 = Road(counted_adt=12345)
        r2 = Road(counted_adt=12345)
        r3 = Road(counted_adt=23456)

        site = Site(roads=[r1, r2, r3], position=Position(
            lat=39.1212, lng=-104.012))
        site.remove_duplicates()

        self.assertListsEqual(site.roads, [r1, r3])


class SiteProcessTestCase(CustomTestCase):

    def setUp(self):
        self.r1 = Road(
            name="I-25", positions=[Position(lat=39.1212, lng=-104.012)])
        self.r2 = Road(
            name="I-70", positions=[Position(lat=39.2424, lng=-104.345)])

        p1 = Population(population=1000, year=2014, county="Denver")
        p2 = Population(population=2000, year=2027, county="Denver")

        county = County(
            current_population=p1,
            future_population=p2,
            name="Denver"
        )

        self.site = Site(roads=[self.r1, self.r2],
                         position=Position(lat=39.1213, lng=-104.013),
                         county=county)

    def test_set_growth_rates(self):
        self.site.set_growth_rates()

        rate = self.site.growth_rate
        for r in self.site.roads:
            self.assertAlmostEqual(r.growth_rate, rate, 3)

    def test_set_distances(self):
        self.site.set_distances()
        self.assertEqual(self.r1.distance, self.r1.positions[
                         0].distance_from(self.site.position))
        self.assertEqual(self.r2.distance, self.r2.positions[
                         0].distance_from(self.site.position))
