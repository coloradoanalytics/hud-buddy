import numpy
import math


def dnl_auto(adt, distance):
    return dnl(adt, distance, 0)


def dnl_heavy_truck(adt, distance):
    return dnl(adt, distance, 1)


def dnl(adt, distance, type):
    type_offset = {0: 54,
                   1: 70}
    return math.ceil(4.34 * numpy.log(adt) - 6.58 * numpy.log(distance) + type_offset[type])


def dnl_sum(dnl_list):
    dnl_sum = 0
    for dnl in dnl_list:
        if dnl and dnl > 1:
            dnl_sum += math.pow(10, (dnl / 10))
    return math.ceil(10 * numpy.log10(dnl_sum))


def night_time_adj():
    nighttime_fraction = float(.15)
    return float(3.813) * nighttime_fraction + float(.425)


def future_aadt(future_pop, current_pop, aadt):
    return (future_pop / current_pop) * float(aadt)


def future_aadt_new(aadt, growth_rate, num_years):
    return aadt * (numpy.exp(growth_rate * num_years))


def growth_rate(starting_pop, future_pop, num_years):
    return numpy.log(future_pop / starting_pop) / num_years


def heavy_truck_count(future_aadt, truck_percentage):
    return future_aadt * (float(truck_percentage) / float(100))


def auto_count(future_aadt, heavy_truck_count, medium_truck_count):
    return future_aadt - heavy_truck_count - medium_truck_count


def medium_truck_count(future_aadt):
    return future_aadt * float(.02)


def effective_auto_aadt(auto_count, medium_truck_count, speed_adjustment_factor, nighttime_adj):
    return (auto_count + 10 * medium_truck_count) * speed_adjustment_factor * nighttime_adj


def effective_heavy_truck_aadt(heavy_truck_count, heavy_truck_speed_adjustment_factor, nighttime_adj):
    return heavy_truck_count * heavy_truck_speed_adjustment_factor * nighttime_adj


def auto_speed_adjustment_factor(speed_limit):
    return math.pow(float(speed_limit), float(2.025)) * float(.0003)


def heavy_truck_speed_adjustment_factor(speed_limit):
    if speed_limit < 50:
        return float(.81)
    else:
        return float(.0376) * speed_limit - float(1.072)
