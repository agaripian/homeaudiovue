/* eslint-disable */
const express    = require('express')
const bodyParser = require('body-parser');
const SerialPort = require("serialport");
const async      = require("async");
const Readline   = require('@serialport/parser-readline')

const app = express()

//var logFormat = "'[:date[iso]] - :remote-addr - :method :url :status :response-time ms - :res[content-length]b'";
//app.use(morgan(logFormat));
app.use(bodyParser.text({type: '*/*'}));

const ReQuery  = /^true$/i.test(process.env.REQUERY);
const UseCORS  = /^true$/i.test(process.env.CORS);
const AmpCount = process.env.AMPCOUNT || 1;
var device     = process.env.DEVICE || "/dev/ttyUSB0";
var connection = new SerialPort(device, {
  baudRate: 9600
});

var parser = new Readline({ delimiter: '\n' });
connection.pipe(parser);

app.get('/zonestest', function(req, res) {
  res.json(`[
    {
        "zone": "11",
        "pa": "00",
        "pr": "00",
        "mu": "00",
        "dt": "00",
        "vo": "29",
        "tr": "07",
        "bs": "07",
        "bl": "10",
        "ch": "04",
        "ls": "00"
    },
    {
        "zone": "12",
        "pa": "00",
        "pr": "00",
        "mu": "00",
        "dt": "00",
        "vo": "38",
        "tr": "07",
        "bs": "07",
        "bl": "10",
        "ch": "04",
        "ls": "00"
    },
    {
        "zone": "13",
        "pa": "00",
        "pr": "00",
        "mu": "00",
        "dt": "00",
        "vo": "20",
        "tr": "07",
        "bs": "07",
        "bl": "10",
        "ch": "04",
        "ls": "00"
    },
    {
        "zone": "14",
        "pa": "00",
        "pr": "00",
        "mu": "00",
        "dt": "00",
        "vo": "20",
        "tr": "07",
        "bs": "07",
        "bl": "10",
        "ch": "04",
        "ls": "00"
    },
    {
        "zone": "15",
        "pa": "00",
        "pr": "00",
        "mu": "00",
        "dt": "00",
        "vo": "20",
        "tr": "07",
        "bs": "07",
        "bl": "10",
        "ch": "04",
        "ls": "00"
    },
    {
        "zone": "16",
        "pa": "00",
        "pr": "00",
        "mu": "00",
        "dt": "00",
        "vo": "20",
        "tr": "07",
        "bs": "07",
        "bl": "10",
        "ch": "04",
        "ls": "00"
    }
]`)
})

connection.on("open", function () {
  var zones = {};

  connection.write("?10\r");
  AmpCount >= 2 && connection.write("?20\r");
  AmpCount >= 3 && connection.write("?30\r");

  UseCORS && app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
  });

  parser.on('data', function(data) {
   // console.log(data);
   // console.log('GOT DATA ^');
    var zone = data.match(/#>(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    if (zone != null) {
      zones[zone[1]] = {
        "zone": zone[1],
        "pa": zone[2],
        "pr": zone[3],
        "mu": zone[4],
        "dt": zone[5],
        "vo": zone[6],
        "tr": zone[7],
        "bs": zone[8],
        "bl": zone[9],
        "ch": zone[10],
        "ls": zone[11]
      };
    }
  });

  app.get('/api/zones', function(req, res) {
    var zoneCount = Object.keys(zones).length;
    if (ReQuery) {
      zones = {};
      connection.write("?10\r");
      AmpCount >= 2 && connection.write("?20\r");
      AmpCount >= 3 && connection.write("?30\r");
    }
    async.until(
      function () {
          return (typeof zones !== "undefined" && Object.keys(zones).length === zoneCount);
        },
      function (callback) {
        setTimeout(callback, 10);
      },
      function () {
        var zoneArray = [];
        for(var o in zones) {
          zoneArray.push(zones[o]);
        }
        res.json(zoneArray);
      }
    );
  });

  // Only allow query and control of single zones
  app.param('zone', function(req, res, next, zone) {
    if (zone % 10 > 0 && Number(zone) != "NaN") {
      req.zone = zone;
      next();
    } else {
      res.status(500).send({ error: zone + ' is not a valid zone'});
    }
  });

  app.get('/zones/:zone', function(req, res) {
    async.until(
      function () { return typeof zones[req.zone] !== "undefined"; },
      function (callback) {
        setTimeout(callback, 10);
      },
      function () {
        res.json(zones[req.zone]);
      }
    );
  });

  // Validate and standarize control attributes
  app.param('attribute', function(req, res, next, attribute) {
    if (typeof attribute !== 'string') {
      res.status(500).send({ error: attribute + ' is not a valid zone control attribute'});
    }
    switch(attribute.toLowerCase()) {
      case "pa":
        req.attribute = "pa";
        next();
        break;
      case "pr":
      case "power":
        req.attribute = "pr";
        next();
        break;
      case "mu":
      case "mute":
        req.attribute = "mu";
        next();
        break;
      case "dt":
        req.attribute = "dt";
        next();
        break;
      case "vo":
      case "volume":
        req.attribute = "vo";
        next();
        break;
      case "tr":
      case "treble":
        req.attribute = "tr";
        next();
        break;
      case "bs":
      case "bass":
        req.attribute = "bs";
        next();
        break;
      case "bl":
      case "balance":
        req.attribute = "bl";
        next();
        break;
      case "ch":
      case "channel":
      case "source":
        req.attribute = "ch";
        next();
        break;
      case "ls":
      case "keypad":
        req.attribute = "ls";
        next();
        break;
      default:
        res.status(500).send({ error: attribute + ' is not a valid zone control attribute'});
    }
  });

  app.post('/zones/:zone/:attribute', function(req, res) {
    zones[req.zone] = undefined;
    connection.write("<"+req.zone+req.attribute+req.body+"\r");
    console.log("<"+req.zone+req.attribute+req.body+"\r")
    connection.write("?10\r");
    AmpCount >= 2 && connection.write("?20\r");
    AmpCount >= 3 && connection.write("?30\r");
    async.until(
      function () { return typeof zones[req.zone] !== "undefined"; },
      function (callback) {
        setTimeout(callback, 10);
      },
      function () {
        res.json(zones[req.zone]);
      }
    );
  });

  app.get('/zones/:zone/:attribute', function(req, res) {
    zones[req.zone] = undefined;
    connection.write("?10\r");
    AmpCount >= 2 && connection.write("?20\r");
    AmpCount >= 3 && connection.write("?30\r");
    async.until(
      function () { return typeof zones[req.zone] !== "undefined"; },
      function (callback) {
        setTimeout(callback, 10);
      },
      function () {
        res.send(zones[req.zone][req.attribute]);
      }
    );
  });

  app.post('/allzones/:attribute', function(req, res) {
    var zoneCount = Object.keys(zones).length;
    var zonesCopy = { ...zones };
    zones = {}
    Object.keys(zonesCopy).forEach(key => {
      connection.write(`<${zonesCopy[key].zone}${req.attribute}${req.body}\r`);
      console.log(`<${zonesCopy[key].zone}${req.attribute}${req.body}\r`);
    })
    connection.write("?10\r");
    AmpCount >= 2 && connection.write("?20\r");
    AmpCount >= 3 && connection.write("?30\r");

    async.until(
      function () {
          return (typeof zones !== "undefined" && Object.keys(zones).length === zoneCount);
        },
      function (callback) {
        setTimeout(callback, 10);
      },
      function () {
        var zoneArray = [];
        for(var o in zones) {
          zoneArray.push(zones[o]);
        }
        res.json(zoneArray);
      }
    );
  });

  app.listen(process.env.PORT || 8181);
});

export default {
  path: '/api',
  handler: app
}
