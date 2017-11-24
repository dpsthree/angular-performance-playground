const content = require('./package.json');
const fs = require('fs');

console.log('content', JSON.stringify(content));
delete content.devDependencies;
fs.writeFile("out/package.json", JSON.stringify(content), function (err) {
  if (err) {
      return console.log(err);
  }

  console.log("The file was saved!");
}); 