from common import CustomTestCase

from locations import Population, County


class GrowthRateTestCase(CustomTestCase):

    def test_get_growth_rate(self):
        p1 = Population(150000, 2014, "denver")
        p2 = Population(250000, 2027, "denver")

        c = County(p1, p2, "denver")
        rate = c.get_growth_rate()

        self.assertAlmostEqual(rate, 0.039, 3)
