//init app with express, util, body-parser, csv2json
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var Converter = require("csvtojson").Converter;

//register body-parser to handle json from res / req
app.use( bodyParser.json() );

//register public dir to serve static files (html, css, js)
app.use( express.static( path.join(__dirname, "public") ) );

/**************************************************************************
****************************** csv2json *********************************
**************************************************************************/
//Converter Class -> read csv file and create jsonObj
var converter = new Converter({
    delimiter: ";"
});
var jsonStruct_countrys = "";
//end_parsed will be emitted once parsing finished
converter.on("end_parsed", function (jsonObject) {
   jsonStruct_countrys = jsonObject;
   updateJSONFile();
});

/**************************************************************************
****************************** handle HTTP GET req ******************
**************************************************************************/
// GET all properties
app.get('/properties', function (req, res) {
    var keys = Object.keys(jsonStruct_countrys[0]);
    res.send( keys );
});

// bind server to port
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});