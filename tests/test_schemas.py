from tests.common import CustomTestCase

from highways import Road, Auto, MediumTruck, HeavyTruck, RoadSchema


class RoadSchemaTestCase(CustomTestCase):

    def test_load(self):
        data = {
            'name': 'test name',
            'distance': 400,
            'counted_adt': 15000,
            'counted_adt_year': 2014,
            'adt': 18000,
            'adt_year': 2027,
            'stop_sign_distance': 300,
            'grade': .02,
            'auto': {
                'adt': 12000,
                'speed': 55,
                'night_fraction': .13,
            },
            'medium_truck': {
                'adt': 2000,
                'speed': 50,
                'night_fraction': .17,
            },
            'heavy_truck': {
                'adt': 4000,
                'speed': 45,
                'night_fraction': .10
            }
        }

        road = RoadSchema().load(data).data
        self.assertEqual(type(road), Road)
        self.assertEqual(type(road.auto), Auto)
        self.assertEqual(type(road.medium_truck), MediumTruck)
        self.assertEqual(type(road.heavy_truck), HeavyTruck)
