from common.clients import CIMClient
from .schemas import RailroadSchemaFromCIM


class RailroadsClient(CIMClient):

    resource_id = '2tib-gtif'
    schema_class = RailroadSchemaFromCIM
    many = True
    rails = []
    position = None

    def get_unique_segments(self, position, distance):
        """
        Performs an API call, removes duplicate rails from the resopnse,
        and sets the distance of each rail from the given position.
        """
        payload = {"$where": "within_circle(the_geom, {}, {}, {})".format(
            position.lat, position.lng, distance)}

        self.position = position

        self.rails = self.get(payload)

        if self.rails:
            self._remove_duplicates()
            for r in self.rails:
                r.distance = r.get_distance(position)

        return self.rails

    def _remove_duplicates(self):
        """
        Remove rail segments with equal distance
        """
        new_rails = []
        distances = set()
        for rail in self.rails:
            if rail.distance not in distances:
                new_rails.append(rail)
                distances.add(rail.distance)
        self.rails = new_rails
