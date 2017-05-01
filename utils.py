from math import radians, cos, sin, asin, sqrt, ceil, log, log10


def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)

    Returns the distance in feet.
    """
    # convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * asin(sqrt(a))
    r = 3959 * 5280  # Radius of earth in feet
    res = (c * r)
    return res


def dnl_sum(dnl_list):
    dnl_sum = 0
    for dnl in dnl_list:
        if dnl and dnl > 1:
            dnl_sum += pow(10, (dnl / 10))
    return ceil(10 * log10(dnl_sum))


def growth_rate(starting_pop, future_pop, num_years):
    return round(log(future_pop / starting_pop) / num_years, 2)
