from tests.custom import CustomTestCase

from roads.models import Road, Auto, MediumTruck, HeavyTruck
from roads.schemas import RoadSchema


class RoadSchemaTestCase(CustomTestCase):
    """
    Test that the RoadSchema class is creating actual
    Road, Auto, MediumTruck and HeavyTruck objects
    when loading the dictionary data.
    """

    def test_load(self):
        data = {
            'name': 'test name',
            'distance': 400,
            'adt': 18000,
            'adt_year': 2027,
            'stop_sign_distance': 300,
            'grade': .02,
            'auto': {
                'adt_fraction': .75,
                'speed': 55,
                'night_fraction': .13,
            },
            'medium_truck': {
                'adt_fraction': .10,
                'speed': 50,
                'night_fraction': .17,
            },
            'heavy_truck': {
                'adt_fraction': .15,
                'speed': 45,
                'night_fraction': .10
            }
        }

        road = RoadSchema().load(data).data
        self.assertEqual(type(road), Road)
        self.assertEqual(type(road.auto), Auto)
        self.assertEqual(type(road.medium_truck), MediumTruck)
        self.assertEqual(type(road.heavy_truck), HeavyTruck)
