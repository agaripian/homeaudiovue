/* eslint-disable */
const express    = require('express')
const bodyParser = require('body-parser');
const SerialPort = require("serialport");
const Readline   = require('@serialport/parser-readline')
const persist    = require('./persist')
const when       = require('tiny-when')
// import express from 'express';
// import bodyParser from 'body-parser';
// import SerialPort from 'serialport';
// import Readline from '@serialport/parser-readline';

const app = express()

console.log('persist config from app: ', persist)

//var logFormat = "'[:date[iso]] - :remote-addr - :method :url :status :response-time ms - :res[content-length]b'";
//app.use(morgan(logFormat));
app.use(bodyParser.text({type: '*/*'}));

const ReQuery  = /^true$/i.test(process.env.REQUERY);
const UseCORS  = /^true$/i.test(process.env.CORS);
let AmpCount = persist.ampcount || process.env.AMPCOUNT || 1;
let device     = persist.device || process.env.DEVICE || "/dev/ttyUSB0";
const connection = new SerialPort(device, {
  baudRate: 9600
});

var parser = new Readline({ delimiter: '\n' });
connection.pipe(parser);

function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}
///TEMPPPpPPPP FOR TESTING!
// const testZones = [{"zone":"11","pa":"00","pr":"00","mu":"00","dt":"00","vo":"29","tr":"07","bs":"07","bl":"10","ch":"04","ls":"00"},{"zone":"12","pa":"00","pr":"00","mu":"00","dt":"00","vo":"38","tr":"07","bs":"07","bl":"10","ch":"04","ls":"00"},{"zone":"13","pa":"00","pr":"00","mu":"00","dt":"00","vo":"20","tr":"07","bs":"07","bl":"10","ch":"04","ls":"00"},{"zone":"14","pa":"00","pr":"00","mu":"00","dt":"00","vo":"20","tr":"07","bs":"07","bl":"10","ch":"04","ls":"00"},{"zone":"15","pa":"00","pr":"00","mu":"00","dt":"00","vo":"20","tr":"07","bs":"07","bl":"10","ch":"04","ls":"00"},{"zone":"16","pa":"00","pr":"00","mu":"00","dt":"00","vo":"20","tr":"07","bs":"07","bl":"10","ch":"04","ls":"00"}]
// app.get('/zones', function(req, res) {
//   res.json(testZones)
// })
console.error('starting api!')
connection.on("open", async function () {
  var zones = {};

  // do the first query
  queryAllZones()
  console.log('AMP COUNT!!!!@@@: ', AmpCount)

  UseCORS && app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
  });
  console.error('waiting for data')

  function saveZoneDataToConfig(zoneId, attr, val) {
    if (!persist.zones) {
      persist.zones = {}
    }
    if (!persist.zones[zoneId]) {
      persist.zones[zoneId] = {}
    }
    persist.zones[zoneId][attr] = val
  }

  function sortOrder(a, b) {
    const aNum = Number(a.order)
    const bNum = Number(b.order)
    if (aNum < bNum) {
      return -1
    }
    if (aNum > bNum) {
      return 1
    }
    return 0
  }

  parser.on('data', function(data) {
    console.log('GOT DATA:', data);
    var zone = data.match(/#>(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    if (zone != null) {
      zones[zone[1]] = {
        "name": persist.zones && persist.zones[zone[1]] && persist.zones[zone[1]].name || zone[1],
        "order": persist.zones && persist.zones[zone[1]] && persist.zones[zone[1]].order.toString() || "-1",
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
      //console.log('returning zone', zones[zone[1]])
    }
  });

  async function queryAllZones(){
    // clear zones object which is written to from parser on data event
    zones = {};
    // create an amps array based on count of amps [1, 2, 3]
    const amps = [...Array(AmpCount)].map((_, i) => i+1)
    // loop through each amp and write ?10\r, ?20\r, ?30\r
    // wait for zones.length to equal 6 * number of amps 6 zones per amp
    for (const amp of amps) {
      console.log('currentAmp', amp);
      connection.write(`?${amp}0\r`);
      const condition = () => Object.keys(zones).length === amp * 6
      await when(condition, { maxChecks: 100, intervalInMs: 50 })
    }
    const zoneArray = [];
    for(var o in zones) {
      zoneArray.push(zones[o]);
    }
    zoneArray.sort(sortOrder)
    return zoneArray
  }

  app.get('/zones', async function(req, res) {
    try {
      const zoneArray = await queryAllZones()
      console.log('got allZones!')
      res.json(zoneArray)
    }
    catch {
      res.status(500).send({ error: 'Cant query all zones!' });
    }
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

  app.get('/zones/:zone', async function(req, res) {
    try {
      await queryAllZones()
      res.json(zones[req.zone]);
    } catch {
      res.status(500).send({ error: 'cant get zone info '+ req.zone});
    }
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
      case "name":
        req.attribute = attribute;
        req.notDevice = true;
        next();
        break;
      case "order":
        req.attribute = attribute;
        req.notDevice = true;
        next();
        break;
      default:
        res.status(500).send({ error: attribute + ' is not a valid zone control attribute'});
    }
  });

  app.post('/zones/:zone/:attribute', async function(req, res) {
    if  (req.notDevice) {
        saveZoneDataToConfig(req.zone, req.attribute, req.body)
    } else {
      connection.write("<"+req.zone+req.attribute+req.body+"\r");
      console.log("<"+req.zone+req.attribute+req.body+"\r")
    }
    try {
      await queryAllZones()
      res.json(zones[req.zone]);
    } catch {
      res.status(500).send({ error: req.attribute + ' cant be set on zone ' + req.zone});
    }
  });

  app.get('/zones/:zone/:attribute', async function(req, res) {
    try {
      //this can be optimized to query the zone only
      await queryAllZones()
      res.send(zones[req.zone][req.attribute]);
    } catch {
      res.status(500).send({ error: req.attribute + ' cant be read from ' + req.zone});
    }
  });

  app.post('/allzones/:attribute', async function(req, res) {
    var zoneCount = Object.keys(zones).length;
    zones = {}
    function write(unit) {
      connection.write(`<${unit}${req.attribute}${req.body}\r`)
      console.log(`<${unit}${req.attribute}${req.body}\r`)
    }

    write(10);
    AmpCount >= 2 && write(20);
    AmpCount >= 3 && write(30);
    console.log('writing all zones');

    try {
      //this can be optimized to query the zone only
      const zoneArray = await queryAllZones()
      res.json(zoneArray);
    } catch {
      res.status(500).send({ error: 'all zones could not be set'});
    }
  });

  app.post('/sortOrder', async function(req, res) {
    var zoneOrder = JSON.parse(req.body)
    Object.keys(zoneOrder).forEach(key => {
      saveZoneDataToConfig(key, 'order', zoneOrder[key].toString())
    })
    // This will force update the zones in memory order data
    await queryAllZones()
  });

  app.get('/ampcount', function(req, res) {
    res.json({AmpCount})
  });

  app.post('/ampcount', function(req, res) {
    const count = Number(req.body)
    console.log('count', count)
    if (count === 1 || count === 2 || count === 3) {
      persist.ampcount = AmpCount = count
      return res.json({AmpCount})
    }
    return res.status(500).send({ error: req.body + ' is not a valid amp count'});
  });

  if (process.env.STANDALONE) {
    app.listen(process.env.PORT || 3000)
  }
});

exports.default = {
  path: '/api',
  handler: app
};
