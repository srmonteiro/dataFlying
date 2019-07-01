import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import simplejson as json
import sqlite3

from flask import Flask, jsonify

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///sample_flights3.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Delay = Base.classes.delayroutes
Week = Base.classes.weeks


# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/weeks<br/>"
        f"/api/delays<br/>"
        
    )


@app.route("/api/weeks")
def names():
    """Return a list of all passenger names"""
    # Query all passengers
    # results = session.query(Week.DAY_OF_WEEK).all()
    # results = session.query(Week.ORIGIN_AIRPORT_NAME).all()

    results = session.query(Week.DAY_OF_WEEK, Week.ORIGIN_AIRPORT_NAME, Week.TOTAL_DELAY).all()

    # Create a dictionary from the row data and append to a list of all_delays
    all_weeks = []
    for DAY_OF_WEEK, ORIGIN_AIRPORT_NAME, TOTAL_DELAY in results:
        week_dict = {}
        week_dict["DAY_OF_WEEK"] = DAY_OF_WEEK
        week_dict["ORIGIN_AIRPORT_NAME"] = ORIGIN_AIRPORT_NAME
        week_dict["TOTAL_DELAY"] = TOTAL_DELAY
        all_weeks.append(week_dict)

    # Convert list of tuples into normal list
    # all_names = list(np.ravel(results))

    return jsonify(all_weeks)

@app.route("/api/delays")
def passengers():
    """Return a list of  data"""
    # Query all delays
    results = session.query(Delay.ROUTE, Delay.DAY, Delay.DELAY).all()

    # Create a dictionary from the row data and append to a list of all_delays
    all_data = []
    for ROUTE, DAY, DELAY in results:
        delay_dict = {}
        delay_dict["ROUTE"] = ROUTE
        delay_dict["DAY"] = DAY
        delay_dict["DELAY"] = DELAY
        all_data.append(delay_dict)

    return jsonify(all_data)

if __name__ == '__main__':
    app.run(debug=True)

