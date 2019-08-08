#!/usr/bin/env node
// const argv = require('yargs').argv;
// console.log(argv);
// const argv = parseArgs(['r', 'd', 'c'], { booleans: 'c', string: 'r', '--': true });
// const ignoreCurrent = argv.c; //boolean
// const ignoreDirs = argv.d; //array of strings 
// const rootDir = argv.r; //string
const fs = require('fs');
const path = require('path');
const root = path.parse(process.cwd()).root;


// module.exports.
const app = (dir, done) => {
  // Checks for valid argument types
  // checkArgs = (ignoreDirs, rootDir) => {
  //   if (typeof ignoreDirs !== 'array') {

  //   }

  //   if (typeof ignoreDirs !== 'array') {

  //   }
  // }

  findPrintDelete = () => {
    let deletedDirPaths = [];

    fs.readdir(dir, (err, list) => {
      //console.log(list)
      if (err) { return done(err); }

      let pending = list.length;

      if (!pending) { return done(null, deletedDirPaths); }

      for (let i = 0; i < list.length; i++) {

        const fileOrFolder = list[i];
        const fileOrFolderPath = path.resolve(dir, fileOrFolder);

        fs.stat(fileOrFolderPath, (err, stat) => {

          if (stat && stat.isDirectory()) {
            const isNotHidden = fileOrFolder[0] != '.';

            if (fileOrFolder === 'node_modules') {  // If node_modules dir, remove dir
              deletedDirPaths = [...deletedDirPaths, fileOrFolderPath];

              fs.rmdir(fileOrFolderPath, (err) => { console.error(err); });

              pending--;
              if (!pending) {
                done(null, deletedDirPaths);
              }

            } else if (isNotHidden) { // If dir is not hidden, execute a recursive call

              app(fileOrFolderPath, (err, res) => {
                if (err) {
                  throw new Error(err);
                } else if (res.length) {
                  deletedDirPaths = deletedDirPaths.concat(res);
                }
                pending--;
                if (!pending) { done(null, deletedDirPaths); }
              });

            } else {
              pending--;
              if (!pending) { done(null, deletedDirPaths); }
            }

          } else {
            pending--;
            if (!pending) { done(null, deletedDirPaths); }
          }
        });

      }


    });
  };
};

app.findPrintDelete(root, (err, data) => {
  if (err) { throw err; }

  console.log(`Root Directory: ${root}
  directories removed: ${data}`);
});

module.exports = app;