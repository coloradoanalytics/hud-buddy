## HudBuddy

#### An application for performing noise analysis to HUD specifications.
***

## Data use architecture

The following datasets are used every time HudBuddy analyzes a location:
1. CIM "HIGHWAYS" dataset (https://data.colorado.gov/dataset/HIGHWAYS/phvc-rwei)
2. CIM "Population Projections in Colorado" dataset (https://data.colorado.gov/Demographics/Population-Projections-in-Colorado/q5vp-adf3)
3. CIM "RAIL_LINES_100k" dataset (https://data.colorado.gov/dataset/RAIL_LINES_100K/2tib-gtif)
4. CIM "Airports" dataset (https://data.colorado.gov/dataset/AIRPORTS/siwx-ebh7)

These datasets are used in the following way:

1. When a user clicks the map, the latitude and longitude of that location are sent to the "Highways" API, which returns a list of highway segments that are within 1500 feet of that point. For each highway, we extract the name, average daily traffic, average daily truck traffic, measurement year, speed limit, and county name.
2. We then send that county name in two separate queries to the "Population" API. One query gives us an actual counted population value, and one gives us a projected value 10 years in the future. From these values we calculate a growth rate for the county, which is necessary for our noise calculations.
3. Next, we query the "Rails" API for all railroad segments within 4500 feet of the location. 
4. And finally, we query the "Airports" API for all airports within 15 miles.
5. Using data from the above responses, as well as some default and user-provided values when necessary, we calculate a DNL (day-night average sound level) value for each highway/rail/airport, and combine these individual DNL values into a total DNL for the location. This value is the final result of our analysis.

## Using the application

Using the site is intuitive and all features can be explored in just a few minutes. The following steps will take you through everything the application does.

1. Go to https://hudbuddy.com
2. Explore the map to find a location that you'd like to analyze. It should be near a highway or busy roadway.
3. Click the location to place a marker and start the analysis. The back-end will query the CIM datasets for roads, rail, and airports within range.
	- If the location is within range of road noise sources only (most likely scenario), there is enough data in the CIM to perform a complete analysis and you will get a value with no warnings.
	- If the location is within range of railroads or airports, it is currently impossible to collect enough information about these noise sources for a complete, automatic analysis. The application tells you as much as it can about these sources and presents a result with appropriate warnings.
4. Drag a marker to a new location on the map. A new data query and analysis will begin.
5. Add multiple markers to the map at different distances from a highway. Closer markers will be louder and may result in different HUD classifications and different marker colors.
6. With a marker selected, click `Send to Form` and all data attached to the current marker will be sent to the editable form.
7. Edit the features of the site and each data source as you like. Add or remove noise sources as you like.
	- Airport DNL must be read from contour maps published by the airport or the FAA
	- Train speed and operations per day must be acquired from the FRA
8. Click `Calculate` whenever you'd like a new calculation of the noise value at the location (will not work with incomplete noise source data)
9. When you're satisfied with your data, click `Generate Report` to open a generated .pdf report in a new window.



## Code walk-through

HudBuddy consists of:

1. a backend API written in Python/Flask
2. a web frontend written in Vue.js

#### Back-End Code

- `server.py`

 This is the main entrypoint for the backend application.  It defines the endpoint routes and implements the logic that runs when these endpoints are hit.


The `GET /` route simply serves the front-end application.

The `GET /api/sites` route is called when the user clicks a location on the map. The latitude and longitude of that location are passed in the querystring. This data is used to query the various CIM databases (see datasets) to find noise sources near that location. Once these sources have been gathered, a `Site` object is created, and a series of calculations are performed to determine the noise level (or `DNL`) of those individual sources, and of the `Site` as a whole. The full `Site` object is returned, with both data from the external datasets and the calculated `DNL` values.

The `POST /api/sites` route is called when the user sends their `Site` to the editable form view, makes changes to the supplied values, and clicks `Calculate`. The front-end passes the complete `Site` JSON object, with the user's modifications, to the back-end, which performs the same acoustical caluculations as in the `GET` endpoint. This allows the user to edit or add to the data returned by CIM as they see fit.

The `POST /api/reports` route is called when the user selects `Generate Report`. The full `Site` JSON object is passed to the backend, which performs the acoustical calculations and then renders the result into a nicely formatted PDF document - the end product of a HudBuddy analysis. The `PyLaTeX` library is used to format and create the PDF file.
***
The rest of the backend is organized into directories, or "apps", corresponding to the noise source or object in question. There are apps for `airports`, `locations`, `railroads`, `roads` and `sites`.

Each app consists of one or more of the following:

- `models.py`
	-  contains classes that model the main objects, such as `Road` or `Airport`
- `schemas.py`
	- contains `Schema` classes, which use the `Marshmallow` library (https://marshmallow.readthedocs.io/en/latest/).
	- These classes are used to
		- Turn JSON data from CIM or from the client into `Road`, `Airport`, etc. objects.
		- Turn those objects back into JSON so they can be sent back to the client.
- `clients.py`
	- contains classes used to manage the interaction with the given CIM dataset. 
 
 The `sites` app contains an additional file, `reports.py`, which handles the creation of the PDF report with `PyLaTex`.
 
**apps**:

- airports
	- `clients.py`
		- interacts with the CIM "Airports" dataset (https://data.colorado.gov/dataset/AIRPORTS/siwx-ebh7)
	- `models.py`
		- defines the `Airport` class
	- `schemas.py`
		- defines schemas to marshall `Airport` objects out of and back into JSON representations.
- common
	- used to store functionality that might be useful to any app
	- `clients.py`
		- defines a base `CIMClient` that other clients inherit from.
	- `utils.py`
		- defines some helper functions for calculating distances, combining DNL's, and calculating county growth rates.
- locations
	- `clients.py`
		- interacts with the CIM "Population Projections in Colorado" dataset (https://data.colorado.gov/Demographics/Population-Projections-in-Colorado/q5vp-adf3)
	- `models.py`
		- defines classes for dealing with counties, population counts, and lat/lon positions.
	- `schemas.py`
		- defines schemas for the above county, population, and position classes.
- railroads
	- `clients.py`
		- interacts with the CIM "RAIL_LINES_100k" dataset (https://data.colorado.gov/dataset/RAIL_LINES_100K/2tib-gtif)
	- `models.py`
		- defines the `Rail` class with methods for DNL calculations.
	- `schemas.py`
		- defines JSON schemas for the `Rail` class.
- roads
	- `clients.py`
		- interacts with the CIM "HIGHWAYS" dataset (https://data.colorado.gov/dataset/HIGHWAYS/phvc-rwei)
	- `models.py`
		- defines classes for roads and vehicle types, with methods for DNL calculations.
	- `schemas.py`
		- defines JSON schemas for roads and vehicle types
- sites
	- `models.py`
		- defines the `Site` class, with methods for DNL calculations
	- `schemas.py`
		- defines JSON schemas for the `Site` class
	- `report.py`
		- turns a `Site` object into a PDF report file using `PyLaTex`.

#### Front-End Code

All front-end files are located in `/static`. Files written by us are in `/static/js`, `/static/html/`, and `/static/css`. All code found in other folders under `/static` are libraries that need to be stored and served locally for one reason or another.

The front end is a simple Vue.js application. Although it is divided into components, it is not written in .vue files and bundled by webpack or similar; templates are written literally and .js files are simply called by index.html.

Communication between components is done through standard Vue tools. Data travels down by defining and passing props. Data and messages travel up through Vue's built-in events.

Data is stored and handled in json objects that represent "sites". A site contains all of the information about a single analysis location, including its coordinates and all of the noise sources that are in range.

- index.html and index.js
	- These files form the base component of the site.
	- index.html loads all javascript files in order, since we are not bundling with webpack
- navbar.js
	- Contains Vue component with the tab control.
	- Clicking a tab causes a tab selection event to be sent to the main component
- map.js, form.js, about.js
	- These files contain the components that make up most of the content in the site
	- All are loaded, but only one is shown at a time depending on the selected tab
- mapinfo.js
	- Contains the components used to display companion info for the map on the map tab
- road|rail|airport|siteform.js
	- Components that permit editing of the individual components of a site
	- When a component is not in edit mode, the "card" version of the component is shown
- road|rail|airport|sitecard.js
	- Components that are used to display pieces of a site when they are not in edit mode
- utils.js
	- Handy functions that are used by multiple components
	
 
## Local development instructions

1. Make sure you have Python 3 installed
2. Use pip3 to install the dependencies in `requirements.txt`
3. `$ python server.py` runs the development server on localhost:5000

## Unit Tests

To run the tests:

`$ python -m unittest discover tests/ -v`
