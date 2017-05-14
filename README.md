## HudBuddy
#### An application for performing noise analysis to HUD specifications.

## Code walk-through

HudBuddy consists of:

1. a backend API written in Python/Flask
2. a web frontend written in Vue.js

#### Back-End Code

- `server.py`

 This is the main entrypoint for the backend application.  It defines the endpoint routes and implements the logic that runs when these endpoints are hit.

Endpoints:

The `GET /` route simply serves the front-end application.

The `GET /api/sites` route is called when the user clicks a location on the map. The latitude and longitude of that location are passed in the querystring. This data is used to query the various CIM databases (see datasets) to find noise sources near that location. Once these sources have been gathered, a `Site` object is created, and a series of calculations are performed to determine the noise level (or `DNL`) of those individual sources, and of the `Site` as a whole. The full `Site` object is returned, with both data from the external datasets and the calculated `DNL` values.

The `POST /api/sites` route is called when the user sends their `Site` to the editable form view, makes changes to the supplied values, and clicks `Calculate`. The front-end passes the complete `Site` JSON object, with the user's modifications, to the back-end, which performs the same acoustical caluculations as in the `GET` endpoint. This allows the user to edit or add to the data returned by CIM as they see fit.

The `POST /api/reports` route is called when the user selects `Generate Report`. The full `Site` JSON object is passed to the backend, which performs the acoustical calculations and then renders the result into a nicely formatted PDF document - the end product of a HudBuddy analysis. The `PyLaTeX` library is used to format and create the PDF file.


 
## Local development instructions

1. Make sure you have Python 3 installed
2. Use pip3 to install the dependencies in `requirements.txt`
3. `$ python server.py` runs the development server on localhost:5000

## Unit Tests

To run the tests:

`$ python -m unittest discover tests/ -v`