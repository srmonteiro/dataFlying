{
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "width": 900,
    "height": 560,
    "padding": {"top": 0, "left": 0, "right": 0, "bottom": 0},
    "signals": [
                {
                "name": "hover",
                "value": null,
                "on": [
                  {"events": "symbol:mouseover", "update": "datum"},
                  {"events": "symbol:mouseout", "update": "null"}
                ]
              },
              {
                "name": "title",
                "value": "U.S. Airports, 2008",
                "update": "hover ? hover.name + ' (' + hover.iata + ')' : 'U.S. Airports, 2008'"
              }
              ],
    "data": [
              {
                  "name": "states",
                  "url": "data/us-10m.json",
                  "format": {"type": "topojson", "feature": "states"},
                  "transform": [
                    {
                      "type": "geopath",
                      "projection": "projection"
                    }
                  ]
              },
              {
                "name": "traffic",
                "url": "data/flights-airport.csv",
                "format": {"type": "csv", "parse": "auto"},
                "transform": [
                  {
                    "type": "aggregate",
                    "groupby": ["origin"],
                    "fields": ["count"], "ops": ["sum"], "as": ["flights"]
                  }
                ]
              },
              {
    "name": "airports",
    "url": "data/airports.csv",
    "format": {"type": "csv", "parse": "auto"},
    "transform": [
      {
        "type": "lookup",
        "from": "traffic", "key": "origin",
        "fields": ["iata"], "as": ["traffic"]
      },
      {
        "type": "filter",
        "expr": "datum.traffic != null"
      },
      {
        "type": "geopoint",
        "projection": "projection",
        "fields": ["longitude", "latitude"]
      },
      {
        "type": "filter",
        "expr": "datum.x != null && datum.y != null"
      },
      {
        "type": "collect", "sort": {
          "field": "traffic.flights",
          "order": "descending"
        }
      }
    ]
  }, 
  {
    "name": "routes",
    "url": "data/flights-airport.csv",
    "format": {"type": "csv", "parse": "auto"},
    "transform": [
      
      {
        "type": "lookup",
        "from": "airports", "key": "iata",
        "fields": ["origin", "destination"], "as": ["source", "target"]
      },
      {
        "type": "filter",
        "expr": "datum.source && datum.target"
      },
      {
        "type": "linkpath",
        "shape": "line"
      }
    ]
  }],
    "scales": [
              {
              "name": "size",
              "type": "linear",
              "domain": {"data": "traffic", "field": "flights"},
              "range": [16, 1000]
            }
            ],
    "projections": [{
                  "name": "projection",
                  "type": "albersUsa",
                  "scale": 1200,
                  "translate": [{"signal": "width / 2"}, {"signal": "height / 2"}]
                  }],
    "marks": [  
    {
    "type": "path",
                "from": {"data": "states"},
                "encode": {
                  "enter": {
                    "fill": {"value": "#dedede"},
                    "stroke": {"value": "white"}
                  },
                  "update": {
                    "path": {"field": "path"}
                  }
                }
              },
              {
      "type": "symbol",
              "from": {"data": "airports"},
              "encode": {
                "enter": {
                  "size": {"value": 16},
                  "fill": {"value": "steelblue"},
                  "fillOpacity": {"value": 0.8},
                  "stroke": {"value": "white"},
                  "strokeWidth": {"value": 1.5}
                },
      "update": {
                "x": {"field": "x"},
                "y": {"field": "y"}
              }
    }},
    {
      "type": "text",
      "interactive": false,
      "encode": {
        "enter": {
          "x": {"signal": "width", "offset": -5},
          "y": {"value": 0},
          "fill": {"value": "black"},
          "fontSize": {"value": 20},
          "align": {"value": "right"}
        },
        "update": {
          "text": {"signal": "title"}
        }
      }
    }, 
    {
    "type": "path",
    "interactive": false,
    "from": {"data": "routes"},
    "encode": {
      "enter": {
        "path": {"field": "path"},
        "stroke": {"value": "black"},
        "strokeOpacity": {"value": 0.15}
      }
    }
  }
  ]
  }
  
  