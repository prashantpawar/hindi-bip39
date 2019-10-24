// server.js
// where your node app starts

// init project
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
var fs = require("fs");
var dbFile = "./.data/sqlite.db";
var exists = fs.existsSync(dbFile);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function() {
  if (!exists) {
    db.run("CREATE TABLE Words (word TEXT)");
    console.log("New table Words created!");

    // insert default dreams
    db.serialize(function() {
      db.run(
        'INSERT INTO Words (word) VALUES ("Find and count some sheep"), ("Climb a really tall mountain"), ("Wash the dishes")'
      );
    });
  } else {
    console.log('Database "Words" ready to go!');
    db.each("SELECT * from Words", function(err, row) {
      if (row) {
        console.log("record:", row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

// endpoint to get all the dreams in the database
// currently this is the only endpoint, ie. adding dreams won't update the database
// read the sqlite3 module docs and try to add your own! https://www.npmjs.com/package/sqlite3
app.get("/getWords", function(request, response) {
  db.all("SELECT * from Words", function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});


app.get("/random", function(request, response) {
  
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
