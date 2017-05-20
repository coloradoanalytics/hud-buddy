import datetime

from pylatex import Document, Section, Tabular, Package
from pylatex.utils import NoEscape, bold


def percent_str(value):
    return("%.2f" % (value * 100))


def num_str(value):
    return("%.0f" % value)


def track_type_str(bolted):
    if bolted:
        return "Bolted"
    return "Welded"


def train_type_str(diesel):
    if diesel:
        return "Diesel"
    return "Electric"


def yes_no_str(val):
    if val:
        return "Yes"
    return "No"


def feet_to_miles(feet):
    if feet and feet > 0:
        return round(feet / 5280, 1)
    return "--"


def generate_report(site, filename):
    # Create document object
    doc = Document()
    # Add Latex packages
    doc.packages.append(Package('graphicx'))
    doc.packages.append(Package('lastpage'))
    doc.packages.append(Package('titling'))
    doc.preamble.append(NoEscape(
        r'\usepackage[tmargin=1in,bmargin=1.5in,lmargin=1.5in,rmargin=2.2in]{geometry}'))
    doc.packages.append(Package('url'))
    doc.packages.append(Package('hyperref', 'hidelinks'))
    doc.packages.append(Package('fancyhdr'))
    # Add document footer
    doc.preamble.append(NoEscape(r'\fancyheadoffset{.5in}'))
    doc.preamble.append(NoEscape(r'\pagestyle{fancy}'))
    doc.preamble.append(NoEscape(r'\cfoot{}'))
    doc.preamble.append(NoEscape(r'\lhead{\LARGE Noise Assesment Location}'))
    doc.preamble.append(
        NoEscape(r'\rhead{\footnotesize Calculations conform to HUD Noise Guidebook}'))
    doc.preamble.append(NoEscape(
        r'\rfoot{\href{https://hudbuddy.com}{https://hudbuddy.com}}'))
    doc.preamble.append(NoEscape(r'\setlength{\headsep}{.75in}'))
    # Get current date
    current_date = datetime.datetime.now()
    doc.append(
        NoEscape(r'\noindent \textbf{ \noindent \Large ' + site.name + r' }'))
    doc.append(NoEscape(r'\hfill'))
    doc.append(
        NoEscape(r'\textbf{\large DNL ' + str(site.get_combined_dnl()) + r'}'))
    doc.append(NoEscape(r'\\ \\'))
    with doc.create(Tabular('c|c|c|c|c|c')) as table:
        table.add_hline()
        table.add_row(('Date', 'User Name', 'Growth Rate',
                       'Roads DNL', 'Rail DNL', 'Airport DNL'))
        table.add_hline()
        table.add_row((current_date.strftime("%B %d, %Y"),
                       site.user_name,
                       percent_str(site.growth_rate) + r'%',
                       site.get_roads_dnl(),
                       site.get_rails_dnl(),
                       site.get_airports_dnl()))

    if site.roads:
        doc.append(Section('Roads', numbering=False))
        for road in site.roads:
            doc.append(bold(road.name))
            doc.append(NoEscape(r'\hfill'))
            doc.append(bold(str(road.get_dnl()) + ' dB'))
            doc.append(NoEscape(r'\\'))
            with doc.create(Tabular('lcccc')) as table:
                table.add_hline()
                table.add_row(('Traffic',
                               'ADT',
                               'Percent of ADT',
                               'Night Fraction',
                               'Speed (mph)'))
                table.add_hline()
                table.add_row(('Autos',
                               num_str(road.auto.adt),
                               percent_str(road.get_auto_adt_fraction()),
                               road.auto.night_fraction,
                               road.auto.speed))
                table.add_row(('Medium Trucks',
                               num_str(road.medium_truck.adt),
                               percent_str(
                                   road.get_medium_truck_adt_fraction()),
                               road.medium_truck.night_fraction,
                               road.medium_truck.speed))
                table.add_row(('Heavy Trucks',
                               num_str(road.heavy_truck.adt),
                               percent_str(
                                   road.get_heavy_truck_adt_fraction()),
                               road.heavy_truck.night_fraction,
                               road.heavy_truck.speed))
                table.add_row(('Total',
                               num_str(road.adt),
                               '-',
                               '-',
                               '-'))
                table.add_hline()

            doc.append(NoEscape(r'\\'))
            with doc.create(Tabular('cccc')) as table:
                table.add_row(('Effective Distance (feet)',
                               'Grade',
                               'Distance to Stop Sign (feet)',
                               'For Year'))
                table.add_hline()
                table.add_row((road.distance,
                               percent_str(road.grade) + "%",
                               road.stop_sign_distance,
                               road.adt_year))
            doc.append(NoEscape(r'\vspace{.25in}'))
            doc.append(NoEscape(r'\\'))
        doc.append(NoEscape(r'\vspace{-.25in}'))

    if site.rails:
        doc.append(Section('Rail', numbering=False))
        for rail in site.rails:
            doc.append(bold(rail.name))
            doc.append(NoEscape(r'\hfill'))
            doc.append(bold(str(rail.get_dnl()) + ' dB'))
            doc.append(NoEscape(r'\\'))
            with doc.create(Tabular('cccc')) as table:
                table.add_hline()
                table.add_row(('Effective Distance (feet)',
                               'Speed (mph)',
                               'Engines per Train',
                               'Cars per Train'))
                table.add_hline()
                table.add_row((rail.distance,
                               rail.speed,
                               rail.engines_per_train,
                               rail.cars_per_train))
                table.add_hline()

            doc.append(NoEscape(r'\\'))

            with doc.create(Tabular('ccccc')) as table:
                table.add_row(('Trains per Day',
                               'Night Fraction',
                               'Type',
                               'Horns',
                               'Tracks'))
                table.add_hline()
                table.add_row((rail.ato,
                               rail.night_fraction,
                               train_type_str(rail.diesel),
                               yes_no_str(rail.horns),
                               track_type_str(rail.bolted_tracks)))

    if site.airports:
        doc.append(Section('Airports', numbering=False))
        for airport in site.airports:
            doc.append(bold(airport.name))
            doc.append(NoEscape(r'\hfill'))
            doc.append(bold(str(airport.get_dnl()) + ' dB'))
            doc.append(NoEscape(r'\\'))
            with doc.create(Tabular('cc')) as table:
                table.add_row(('Type',
                               'Distance (miles)'))
                table.add_hline()
                table.add_row((airport.airport_type,
                               feet_to_miles(airport.distance)))

        doc.append(NoEscape(r'\\'))

    doc.generate_pdf(filename, clean_tex=False)
