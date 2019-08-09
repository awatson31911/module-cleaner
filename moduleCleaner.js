#!/usr/bin/env node
const argv = require('yargs').argv;
const fs = require('fs-extra');
const path = require('path');


const root = argv.r; // User input option - root directory to begin traversal from
const includeCurrentDirInput = argv.c; // User input option - boolean to include current dir when deleting node_modules
const currentDir = path.parse(process.cwd()).base;
const ignoreDirsInput = argv._; // User input option - directories to ignore
let dirsToIgnore = [currentDir, 'module-cleaner', 'usr', 'Windows', 'System Volume Information', 'Applications', 'Application Support', 'AppData', 'Application Data', 'Cookies', 'Program Files', 'Program Files(x86)', 'Local Settings', 'Documents and Settings', 'Windows', ...ignoreDirsInput];

if (includeCurrentDirInput) dirsToIgnore = dirsToIgnore.filter( (dir) => dir !== currentDir);

const app = {
 
  findPrintDelete(root, directoriesToIgnore, done) {
    if (root === undefined) {
      throw new Error('Please provide a main directory to find node_modules in');  
    }

    let deletedDirPaths = [];

    fs.readdir(root, (err, list) => {
      if (err) { return done(err); }

      let pending = list.length;

      if (!pending) { return done(null, deletedDirPaths); }

      for (let i = 0; i < list.length; i++) {

        const fileOrFolder = list[i];
        const fileOrFolderPath = path.resolve(root, fileOrFolder);

        fs.stat(fileOrFolderPath, (err, stat) => {

          if (stat && stat.isDirectory()) {
            const isNotHidden = fileOrFolder[0] != '.';

            if (fileOrFolder === 'node_modules') {  // If node_modules dir, remove dir
              
              fs.remove(fileOrFolderPath, err => {
                if (err) return done(err);
                
                deletedDirPaths = [...deletedDirPaths, fileOrFolderPath];
                pending--;
                if (!pending) {
                  done(null, deletedDirPaths);
                }
              });


            } else if (isNotHidden && !directoriesToIgnore.includes(fileOrFolder)) { // If dir is not hidden, execute a recursive call

              this.findPrintDelete(fileOrFolderPath, directoriesToIgnore, (err, res) => {
                if (err && !['EACCES', 'EPERM'].includes(err.code)) {
                  throw new Error(err);
                }
                else if (res) {
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
  }
};

app.findPrintDelete(root, dirsToIgnore, (err, data) => {
  if (err) { throw err; }

  console.log(`
  root directory: ${root}
  directories removed:
    ${data.join('\n')}
  `);
});


module.exports = app;