## HudBuddy

#### An application for performing noise analysis to HUD specifications.
***
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

 
## Local development instructions

1. Make sure you have Python 3 installed
2. Use pip3 to install the dependencies in `requirements.txt`
3. `$ python server.py` runs the development server on localhost:5000

## Unit Tests

To run the tests:

`$ python -m unittest discover tests/ -v`