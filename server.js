var application_root = __dirname;
var express = require("express");
var path = require("path");
const cors = require('cors');
var mongojs = require('mongojs');
var session = require('express-session');
var app = express();
var databaseUrl = "";
var collections = ["platos"];
var db = mongojs(databaseUrl, collections);


app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({
    extended: true
  }));
  app.use(express.static(path.join(__dirname, 'static')));
});



app.get('/api', function(req, res) {
  res.send('Our Sample API is up...');
});

app.get('/getcontent', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  db.platos.find('', function(err, data) {
    if (err || !data) console.log("No platos found");
    else {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      str = '[';
      data.forEach(function(ent1) {
        str = str + '{ "name" : "' + ent1.name + '",' + '"image" : "' + ent1.image + '",' + '"decription" : "' + ent1.decription + '",' +  '"price" : ' + ent1.price + ',' +  '"id" : "' + ent1._id + '",' +  '"nutricion" : "' + ent1.nutricion + '",' +  '"isOnSale" : ' + ent1.isOnSale + ',' +  '"quantityInCart" : ' + ent1.quantityInCart+ '},' + '\n';
      });
      str = str.trim();
      str = str.substring(0, str.length - 1);
      str = str + ']';
      res.end(str);
    }
  });
});

app.get('/getvideos', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  db.videos.find('', function(err, data) {
    if (err || !data) console.log("No videos found");
    else {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      str = '[';
      data.forEach(function(ent1) {
        str = str + '{ "name" : "' + ent1.name + '",' + '"image" : "' + ent1.image + '",' + '"decription" : "' + ent1.decription + '",' +  '"duration" : ' + ent1.duration + ',' +  '"id" : "' + ent1._id + '",' +  '"provider" : "' + ent1.provider + '",' +  '"embed" : ' + ent1.embed + ',' +  '"category" : ' + ent1.category+',' +  '"artist" : ' + ent1.artist+',' +  '"tags" : ' + ent1.tags+ '},' + '\n';
      });
      str = str.trim();
      str = str.substring(0, str.length - 1);
      str = str + ']';
      res.end(str);
    }
  });
});

app.post('/insertplato', function(req, res) {
  console.log("POST: ");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  name = req.body.name;
  structure = req.body.structure;
  console.log(req.body);
  console.log(req.body.mydata);
  var jsonData = JSON.parse(req.body.mydata);
  console.log(jsonData.name);
  console.log(jsonData.structure);
  db.platos.save({
    name: jsonData.name,
    structure: jsonData.structure
  }, function(err, saved) {
    if (err || !saved) res.end("Plato not saved");
    else res.end("Plato saved");
  });
});



app.listen(8080);
