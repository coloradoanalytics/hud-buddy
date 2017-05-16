import os

import requests


class CIMClient:

    base_url = 'https://data.colorado.gov/resource/{}.json'
    resource_id = None
    url = None
    schema_class = None

    session = requests.session()

    def __init__(self):
        self.url = self.base_url.format(self.resource_id)
        self.token = os.environ.get('HUDBUDDY_CIM_TOKEN', '')

    def get(self, payload, context=None):
        headers = {'X-App-Token': self.token}
        response = self.session.get(
            self.url, params=payload, headers=headers).json()
        schema = self.schema_class(many=self.many)
        schema.context = context
        return schema.load(response).data
