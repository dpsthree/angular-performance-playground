const path = require('path');
const express = require('express');
const fs = require("fs");
const bodyParser = require("body-parser");
const faker = require('faker');
const _ = require('lodash');
const cors = require('cors');

// Collection of colors to randomly assign
const colorList = [
  '#1565c0',
  '#5e92f3',
  '#003c8f',
  '#e91e63',
  '#ff6090',
  '#b0003a'
]

// use faker to create count random people
// associate them with a color and add to list
function generatedData(count) {
  
  const entities = []
  for (let i = 0; i < count; i++) {
    entities.push({ displayName: faker.name.findName(), index: i, color: colorList[Math.floor(Math.random() * 6)] });
  }
  
  // For each entity, make sure that they have a relationship.
  // That relationship can not be to themselves and cannot
  // equal to a relationships that was previously generated
  const relationships = [];
  for (let i = 0; i < count; i++) {
    let found = false;
    
    const source = entities[i];
    let target;
    do {
      target = entities[Math.floor(Math.random() * count)];
      found = !!_.find(relationships, link => {
        return (
          link.source === source && link.target === target ||
          link.source === target && link.target === source ||
          source === target
        );
      })
    } while (found)
    relationships.push({ source: source.displayName, target: target.displayName });
  }
  return { entities, relationships };
}

// Create a server
const app = express();

// Setup JSON handling
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.set("json spaces", 2);

// Run the app by serving the static files
// in the www directory
app.use(express.static(__dirname + '/www'));

// Return a number of nodes as specified
app.get('/v1/details/:count', cors(), (req, res) => {
  if (req.params.count && req.params.count <= 5000 && req.params.count >= 0) {
    res.type('json').json(generatedData(req.params.count));
  } else {
    // TODO make this a 500
    res.type('json').json(generatedData(0));
  }
})

// Respond with the generated data
app.get('/v1/details', cors(), (req, res) => {  
  res.type('json').json(generatedData(1000));
})

app.get('/', function (req, res) {
  res.redirect('/app');
})

// For all remaining GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/app*', function (req, res) {  
  res.sendFile(path.join(__dirname + '/www/index.html'));
});

// Run the app by serving the static files
// in the www directory
app.use(express.static(__dirname + '/www'));

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);

// Report when done
console.log('listening on ' + (process.env.PORT || 8080))