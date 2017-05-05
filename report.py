from pylatex import Document, Section, Subsection, Subsubsection, Tabular, Math, Figure, Matrix, Command
import datetime
from pylatex.utils import italic, NoEscape
from pylatex import Package

def generate_report(site,filename):
    #Set Document Geometry
    geom_opts = {"tmargin":"1cm","lmargin":"1in"}
    #Create document object
    doc = Document(geometry_options=geom_opts)
    #Add Latex packages
    doc.packages.append(Package('graphicx'))
    doc.packages.append(Package('background'))
    doc.packages.append(Package('lastpage'))
    doc.packages.append(Package('titling'))
    doc.packages.append(Package('geometry'))
    doc.packages.append(Package('url'))
    #Add document footer
    doc.preamble.append(NoEscape(get_background_string()))
    #Get current date
    current_date = datetime.datetime.now()
    doc.append(NoEscape(r'\centering'))
    doc.append(Section('Summary'))
    with doc.create(Tabular('c|c')) as table:
        table.add_row((site.name,site.combined_dnl))
        table.add_hline()
        table.add_row(('County',site.county))
        table.add_row(('Growth Rate',site.growth_rate))
        table.add_row(('User Name',site.user_name))
        table.add_row(('Date',current_date.strftime("%B %d, %Y")))
 
    doc.append(Section('Roads'))
    for road in site.roads:
        doc.append(Subsubsection(road.name + ' | ' + road.dnl))
        with doc.create(Tabular('lcccc')) as table:
            table.add_row(('Traffic','ADT','Percent of ADT','Night Fraction','Speed (mph)'))
            table.add_hline()
            table.add_row(('Total',road.adt))
            table.add_row(('Autos',road.auto.adt,road.auto.adt_fraction,road.auto.night_fraction,road.auto.speed))
            table.add_row(('Autos',road.medium_truck.adt,road.medium_truck.adt_fraction,road.medium_truck.night_fraction,road.medium_truck.speed))
            table.add_row(('Autos',road.heavy_truck.adt,road.heavy_truck.adt_fraction,road.heavy_truck.night_fraction,road.heavy_truck.speed))

        doc.append(NoEscape(r'\\'))
        with doc.creat(Tabular('cccc')) as table:
            table.add_row(('Effective Distance (feet)','Grade','Distance to Stop Sign (feet)','For Year'))
            table.add_hline()
            table.add_row((road.distance,road.grade,road.stop_sign_distance,road.adt_year))
    doc.append(Section('Rails'))
    for rail in site.rails:
        doc.append(Subsection(rail.name + ' | ' + rail.dnl))
        with doc.create(Tabular('cccc')) as table:
            table.add_row(('Effective Distance (feet)', 'Speed (mph)', 'Engines per Train', 'Cars per Train'))
            table.add_hline()
            table.add_row((rail.distance, rail.speed, rail.engines_per_train, rail.cars_per_train))
	
        doc.append(NoEscape(r'\\'))
        
        with doc.create(Tabular('ccccc')) as table:
            table.add_row(('Trains per Day', 'Night Fraction', 'Diesel', 'Horns', 'Bolted Tracks'))
            table.add_hline()
            table.add_row((rail.ato, rail.night_fraction, rail.diesel, rail.horns, rail.bolted_tracks))

    doc.generate_pdf(filename,clean_tex=True, compiler_args=['xlatex'])

def get_background_string():
  background_string = r'\backgroundsetup{ scale=1, color=black, opacity=1, angle=0, position=current page.south, vshift=60pt, contents={ \small\sffamily \begin{minipage}{.8\textwidth} \parbox[b]{.6\textwidth}{Page \thepage\ of   \pageref{LastPage}}\hfill\parbox[b]{.4\textwidth}{\raggedleft HUDL by HUD-Buddy \\ Denver, CO}\      \textcolor{orange}{\rule{\textwidth}{1.5pt}}\ \url{www.hudbuddy.com/hudl}\end{minipage}\hspace{.02\textwidth}\begin{minipage}{.18\textwidth}\includegraphics[width=\linewidth,height=70pt,keepaspectratio]{hudl.png}\end{minipage}}}'
  return background_string
