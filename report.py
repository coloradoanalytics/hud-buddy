from pylatex import Document, Section, Subsection, Subsubsection, Tabular, Math, Figure, Matrix, Command
import datetime
from pylatex.utils import italic, NoEscape
from pylatex import Package

def generate_report(input_object,responses):
    geom_opts = {"tmargin":"1cm","lmargin":"1in"}
    doc = Document(geometry_options=geom_opts)
    doc.packages.append(Package('graphicx'))
    doc.packages.append(Package('background'))
    doc.packages.append(Package('lastpage'))
    doc.packages.append(Package('titling'))
    doc.packages.append(Package('geometry'))
    doc.packages.append(Package('url'))
    now = datetime.datetime.now()
    #doc.preamble.append(Command('title', 'Environmental Review: Day Night Level'))
    doc.preamble.append(NoEscape(r'\setlength{\droptitle}{4cm}'))
    doc.preamble.append(NoEscape(r'\title{Environmental Review: Day Night Level}'))
    doc.preamble.append(NoEscape(get_background_string()))
    #doc.preamble.append(Command('date', now.strftime("%B %d, %Y")))
    #doc.preamble.append(Command('author', "Prepared For " + input_object['developer_name']))
    doc.preamble.append(NoEscape(r"\author{Prepared For " + input_object['developer_name'] + r"}"))
    doc.append(NoEscape(r'\maketitle'))
    doc.append(NoEscape(r'\centering'))
    with doc.create(Tabular('c|c|c')) as table:
        table.add_row(('Site ID','Record Date','User\'s Name'))
        table.add_hline()
        table.add_row((input_object['site_id'],now.strftime("%B %d, %Y"),input_object['users_name']))
    doc.append(NoEscape(r"\\"))
    doc.append(NoEscape(r"\includegraphics{hudl.png}"))
    
    doc.append(NoEscape(r'\newpage'))
    doc.append(NoEscape(r'\tableofcontents'))
    doc.append(NoEscape(r'\newpage'))
    
    for response in responses['responses']:
        with doc.create(Section('Site: ' + response['site_id'])):
            for segment in response['segments']:
                doc.append(Subsubsection('Road Name: ' + segment['street_name']))
                with doc.create(Tabular('lccc')) as table:
                    table.add_row(('Vehicle Type','Cars','Medium Trucks','Heavy Trucks'))
                    table.add_hline()
                    dist = int(segment['distance'])
                    table.add_row(('Effective Distance (ft)',dist,dist,dist))
                    table.add_row(('Distance to Stop Sign',0,0,0))
                    table.add_row(('Average Speed',0,0,0))
                    table.add_row(('Average Daily Trips (ADT)',0,0,0))
                    table.add_row(('Night Fraction of ADT',0,0,0))
                    table.add_row(('Road Gradient (%)',0,0,0))
                    table.add_row(('Vehicle DNL',0,0,0))
                    table.add_empty_row()
                    table.add_row(('Road DNL',0,'',''))
                    doc.append(NoEscape(r'\\'))
            doc.append(Subsubsection('Combined DNL'))
            with doc.create(Tabular('lc')) as table:
                table.add_row(('Airport Noise Level',0))
                table.add_row(('Loud Impulse Sounds?','No'))
                table.add_row(('Road & Rail DNL',0))
                table.add_row(('DNL Including Airport',0))
                table.add_row(('Site DNL with Loud Impulse Sound',0))
        doc.append(NoEscape(r'\newpage'))

    doc.generate_pdf('report',clean_tex=False, compiler_args=['xlatex'])

def get_background_string():
  background_string = r'\backgroundsetup{ scale=1, color=black, opacity=1, angle=0, position=current page.south, vshift=60pt, contents={ \small\sffamily \begin{minipage}{.8\textwidth} \parbox[b]{.6\textwidth}{Page \thepage\ of   \pageref{LastPage}}\hfill\parbox[b]{.4\textwidth}{\raggedleft HUDL by HUD-Buddy \\ Denver, CO}\      \textcolor{orange}{\rule{\textwidth}{1.5pt}}\ \url{www.hudbuddy.com/hudl}\end{minipage}\hspace{.02\textwidth}\begin{minipage}{.18\textwidth}\includegraphics[width=\linewidth,height=70pt,keepaspectratio]{hudl.png}\end{minipage}}}'
  return background_string
