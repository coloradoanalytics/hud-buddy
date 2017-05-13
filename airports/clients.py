from common.clients import CIMClient
from .schemas import AirportSchemaFromCIM


class AirportsClient(CIMClient):

    # curl -X GET
    # `https://data.colorado.gov/resource/siwx-ebh7.json?
    # $where=within_circle(the_geom,39.890105,-104.75206,24140)`

    # https://dev.socrata.com/foundry/data.colorado.gov/siwx-ebh7
    resource_id = 'siwx-ebh7'
    schema_class = AirportSchemaFromCIM
    many = True
    airports = []
    position = None

    def get_airports(self, position, distance):
        payload = {"$where": "within_circle(the_geom, {}, {}, {})".format(
            position.lat, position.lng, distance)}

        self.position = position

        self.airports = self.get(payload)

        if self.airports:
            self._remove_small_airports()

        return self.airports

    def _remove_small_airports(self):
        """
        Remove airports from list that are are not
        commercial, reliever, or military.
        """
        new_airports = []
        for a in self.airports:
            if "CS" in a.airport_type or "Military" in a.airport_type:
                new_airports.append(a)

        self.airports = new_airports
