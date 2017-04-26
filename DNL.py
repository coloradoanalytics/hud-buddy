import numpy
import math


def dnl_sum(dnl_list):
    print(dnl_list)
    dnl_sum = 0
    for dnl in dnl_list:
        if dnl and dnl > 1:
            dnl_sum += math.pow(10, (dnl / 10))
    return math.ceil(10 * numpy.log10(dnl_sum))


def growth_rate(starting_pop, future_pop, num_years):
    return numpy.log(future_pop / starting_pop) / num_years
