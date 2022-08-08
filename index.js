// Imports.
import { writeFile, readFile, readdir, appendFile } from 'fs';
import { parse } from 'path';
import { detect } from 'detect-package-manager';
import { exec } from 'child_process';
import { micromark } from 'micromark';
let args = process.argv;
// Intial boilerplate
let content = `
const express = require('express')
const app = express()
const port = 3000
`;
if (args[2] == "--port") {
    let content = `
const express = require('express')
const app = express()
const port = ${args[3]}
`;
    // Write the initial boilerplate
    writeFile('./express.cts', content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}
else {
    // Write the initial boilerplate
    writeFile('./express.cts', content, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}
// Create routes boilerplate function
function createRoutes(nfile) {
    if (nfile == "index") {
        let acontent = `
app.get('/', (req: any, res: any) => {
  res.sendFile('./app/${nfile}.html', { root: __dirname })
})
`;
        appendFile('./express.cts', acontent, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    }
    let acontent = `
app.get('/${nfile}', (req: any, res: any) => {
  res.sendFile('./app/${nfile}.html', { root: __dirname })
})
        `;
    appendFile('./express.cts', acontent, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}
function writeStartContent(nfile, startContent) {
    writeFile(`./app/${nfile}.html`, startContent, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}
function addTranspiledHtml(nfile, nhtml) {
    appendFile(`./app/${nfile}.html`, nhtml, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}
function addEndContent(nfile, endContent) {
    appendFile(`./app/${nfile}.html`, endContent, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
}
function addCss(nfile, openCSS, endCss) {
    readdir("./style", function (err, files) {
        files.forEach(function (file) {
            let cfile = parse(file).name;
            if (cfile == nfile) {
                readFile(`./style/${file}`, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    appendFile(`./app/${nfile}.html`, openCSS, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                    appendFile(`./app/${nfile}.html`, data, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                    appendFile(`./app/${nfile}.html`, endCss, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                });
            }
            else if (parse(file).name == nfile && parse(file).ext == "sass") {
                exec(`sass style/${nfile}.sass style/${nfile}.css`, (error) => {
                    if (error) {
                        console.error(error);
                    }
                });
                readFile(`./style/${file}`, 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    appendFile(`./app/${nfile}.html`, openCSS, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                    appendFile(`./app/${nfile}.html`, data, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                    appendFile(`./app/${nfile}.html`, endCss, (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    });
                });
            }
        });
    });
}
console.log('Buiding...');
readdir("./posts", function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        let nfile = parse(file).name;
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
`;
        let endContent = `
  </body>
</html>
      `;
        let openCss = `
<style>
      `;
        let endCss = `
</style>
`;
        createRoutes(nfile);
        readFile(`./posts/${file}`, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const nhtml = micromark(data);
            writeStartContent(nfile, startContent);
            addCss(nfile, openCss, endCss);
            addTranspiledHtml(nfile, nhtml);
            addEndContent(nfile, endContent);
        });
    });
});
let finalcontent = `
app.listen(port, () => {
  console.log("Example app listening on port " + port);
})
`;
appendFile('./express.cts', finalcontent, (err) => {
    if (err) {
        console.error(err);
        return;
    }
});
if (args[2] != "--silent") {
    console.log('Done! You can now run the the app by running');
    detect().then((pm) => {
        if (pm == 'npm') {
            console.log('\n npm run dev');
        }
        else if (pm == 'yarn') {
            console.log('\n yarn dev');
        }
        else if (pm == 'pnpm') {
            console.log('\n pnpm dev');
        }
    });
}
