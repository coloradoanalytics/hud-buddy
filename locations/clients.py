from common.clients import CIMClient
from .schemas import CountyPopulationByAgeSchema
from .models import CountyPopulationByAgeGroup


class PopulationsClient(CIMClient):

    resource_id = 'tv8u-hswn'
    schema_class = CountyPopulationByAgeSchema
    many = True

    def __init__(self, county_name, year):
        super().__init__()
        self.county_name = county_name
        self.year = year

    def get_populations(self):
        """
        Perform the API request.
        """
        payload = {"county": self.county_name, "year": self.year}
        data = self.get(payload)
        return CountyPopulationByAgeGroup(populations=data)
