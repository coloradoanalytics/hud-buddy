import numpy
import math

def dnlAuto(adt, distance):
    return dnl(adt, distance, 0)

def dnlHeavyTruck(adt, distance):
    return dnl(adt, distance, 1)

def dnl(adt, distance, type):
    typeOffset = {0:54,
                  1:70}
    return math.ceil(4.34 * numpy.log(adt) - 6.58 * numpy.log(distance) + typeOffset[type])

def dnlSum(*arg):
    sum = 0
    for argument in arg:
        sum += math.pow( 10, (argument/10))
    return math.ceil(10 * numpy.log10( sum ))

def nightTimeAdj():
    nighttime_fraction = float(.15)
    nighttime_adj = float(3.813) * nighttime_fraction + float(.425)
    return nighttime_adj

def futureAadt(future_pop, current_pop, aadt):
    future_aadt = (future_pop / current_pop) * float(aadt)
    return future_aadt

def heavyTruckCount(future_aadt, truck_percentage):
    truck_count = future_aadt * (float(truck_percentage) / float(100))
    return truck_count

def autoCount(future_aadt, heavy_truck_count, medium_truck_count):
    auto_count = future_aadt - heavy_truck_count - medium_truck_count
    return auto_count

def mediumTruckCount(future_aadt):
    return future_aadt * float(.02)

def effectiveAutoAadt(auto_count, medium_truck_count, speed_adjustment_factor, nighttime_adj):
    effective_auto_aadt = ( auto_count + 10 * medium_truck_count ) * speed_adjustment_factor * nighttime_adj
    return effective_auto_aadt

def effectiveHeavyTruckAadt(heavy_truck_count, heavy_truck_speed_adjustment_factor, nighttime_adj):
    effective_heavy_truck_aadt = heavy_truck_count * heavy_truck_speed_adjustment_factor * nighttime_adj
    return effective_heavy_truck_aadt

def autoSpeedAdjustmentFactor(speed_limit):
    auto_speed_adjustment_factor = math.pow(float(speed_limit), float(2.025)) * float(.0003)
    return auto_speed_adjustment_factor

def heavyTruckSpeedAdjustmentFactor(speed_limit):
    if speed_limit < 50:
        heavy_truck_speed_adjustment_factor = float(.81)
    else:
        heavy_truck_speed_adjustment_factor = float(.0376) * speed_limit - float(1.072)
    return heavy_truck_speed_adjustment_factor
