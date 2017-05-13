class Airport:

    def __init__(self, *args, **kwargs):
        self.position = kwargs.get('position', None)
        self.airport_type = kwargs.get('airport_type', None)
        self.annual_ops = kwargs.get('annual_ops', 0)
        self.name = kwargs.get('name', "Unidentified Airport")
        self.dnl = kwargs.get('dnl', None)
        self.distance = kwargs.get('distance', None)

    def set_distance(self, position):
        self.distance = round(self.position.distance_from(position), 0)

    def get_dnl(self):
        return self.dnl
