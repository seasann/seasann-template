// Imports.
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Intial boilerplate
let content = `
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send("Hello!")
})

`

// Write the initial boilerplate
fs.writeFile('./express.js', content, err => {
  if (err) {
    console.error(err)
    return
  }
})

// Create routes boilerplate function
function createRoutes(nfile){
  let acontent = `
  app.get('/${nfile}', (req, res) => {
    res.sendFile('./app/${nfile}.html', { root: __dirname })
  })
        `
  fs.appendFile('./express.js', acontent, err => {
    if (err) {
      console.error(err)
        return
      }
  })
}

function writeStartContent(nfile, startContent){
  fs.writeFile(`./app/${nfile}.html`, startContent, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}

function addTranspiledHtml(nfile, nhtml){
  fs.appendFile(`./app/${nfile}.html`, nhtml, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}

function addEndContent(nfile, endContent){
  fs.appendFile(`./app/${nfile}.html`, endContent, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}

console.log('Buiding...')
fs.readdir("./posts", function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {     
      let nfile = path.parse(file).name;
      let startContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${nfile}</title>
  </head>
  <body>
`
      let endContent = `
  </body>
</html>
      `
      createRoutes(nfile)
      fs.readFile(`./posts/${file}`, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const nhtml = marked.parse(data);
        writeStartContent(nfile, startContent)
        addTranspiledHtml(nfile, nhtml)
        addEndContent(nfile, endContent)
        }
      );
    });
});

let finalcontent = `
app.listen(port, () => {
  console.log("Example app listening on port " + port);
})
`

fs.appendFile('./express.js', finalcontent, err => {
  if (err) {
    console.error(err)
    return
  }
})




console.log('Done! You can now run the the app by running')
console.log('\n   node express.js')