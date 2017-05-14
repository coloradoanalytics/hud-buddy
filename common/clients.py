import requests


class CIMClient:

    base_url = 'https://data.colorado.gov/resource/{}.json'
    resource_id = None
    url = None
    schema_class = None

    session = requests.session()

    def __init__(self):
        self.url = self.base_url.format(self.resource_id)

    def get(self, payload, context=None):
        response = self.session.get(self.url, params=payload).json()
        schema = self.schema_class(many=self.many)
        schema.context = context
        return schema.load(response).data
