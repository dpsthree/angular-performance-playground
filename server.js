const path = require('path');
const express = require('express');
const fs = require("fs");
const bodyParser = require("body-parser");
const faker = require('faker');
const _ = require('lodash');

// How many entities to display
const NODE_COUNT = 1000;

// Collection of colors to randomly assign
const colorList = [
  '#1565c0',
  '#5e92f3',
  '#003c8f',
  '#e91e63',
  '#ff6090',
  '#b0003a'
]

// use faker to create NODE_COUNT random people
// associate them with a color and add to list
const generatedNodes = []
for (let i = 0; i < NODE_COUNT; i++) {
  generatedNodes.push({ displayName: faker.name.findName(), index: i, color: colorList[Math.floor(Math.random() * 6)] });
}

// For each entity, make sure that they have a relationship.
// That relationship can not be to themselves and cannot
// equal to a relationships that was previously generated
const generatedLinks = [];
for (let i = 0; i < NODE_COUNT; i++) {
  let found = false;

  const source = generatedNodes[i];
  let target;
  do {
    target = generatedNodes[Math.floor(Math.random() * NODE_COUNT)];
    found = !!_.find(generatedLinks, link => {
      return (
        link.source === source && link.target === target ||
        link.source === target && link.target === source ||
        source === target
      );
    })
  } while (found)
  generatedLinks.push({ source: source.displayName, target: target.displayName });
}

// Create a server
const app = express();

// Setup JSON handling
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("json spaces", 2);

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));

// Respond with the genrated data
app.get('/v1/details', (req, res) => {
  res.type('json').json({entities: generatedNodes, relationships: generatedLinks})
})

// For all remaining GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});


// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);

// Report when done
console.log('listening on ' + (process.env.PORT || 8080))