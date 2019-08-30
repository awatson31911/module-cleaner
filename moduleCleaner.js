#!/usr/bin/env node

const argv = require('yargs').argv;
const fs = require('fs-extra');
const path = require('path');
const readlineSync = require('readline-sync');


const root = argv.r; // User input option - root directory to begin traversal from
const bypassChecks = argv.f; // User input option - boolean to bypass user check before deleting node_modules
const ignoreCurrentDirInput = argv.c; // User input option - boolean to ignore current dir when deleting node_modules
const currentDir = path.parse(process.cwd()).name;
const ignoreDirsInput = argv._; // User input option - directories to ignore
let dirsToIgnore = ['module-cleaner', 'usr', 'Windows', 'System', 'System Volume Information', 'Applications', 'Application Support', 'AppData', 'Application Data', 'Cookies', 'Program Files', 'Program Files(x86)', 'Local Settings', 'Documents and Settings', ...ignoreDirsInput];

if (ignoreCurrentDirInput) dirsToIgnore = [currentDir, ...dirsToIgnore];

const app = {

  findPrintDelete(root, directoriesToIgnore, bypassChecks, done) {
    if (root === undefined) {
      throw new Error('Please provide a main directory to find node_modules in');
    }
    if (root === '/') {
      throw new Error('Please provide a folder lower in your file directory');
    }
    if (root === 'C:\\') {
      throw new Error('Please provide a folder lower in your file directory');
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

              if (!bypassChecks) {
                if (readlineSync.keyInYNStrict(`Delete ${fileOrFolderPath}?`)) {
                  fs.remove(fileOrFolderPath, err => {
                    if (err) return done(err);

                    deletedDirPaths = [...deletedDirPaths, fileOrFolderPath];
                    pending--;
                    if (!pending) {
                      done(null, deletedDirPaths);
                    }
                  });
                }
              } else {
                fs.remove(fileOrFolderPath, err => {
                  if (err) return done(err);

                  deletedDirPaths = [...deletedDirPaths, fileOrFolderPath];
                  pending--;
                  if (!pending) {
                    done(null, deletedDirPaths);
                  }
                });

              }


            } else if (isNotHidden && !directoriesToIgnore.includes(fileOrFolder)) { // If dir is not hidden, execute a recursive call

              app.findPrintDelete(fileOrFolderPath, directoriesToIgnore, bypassChecks, (err, res) => {
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

app.findPrintDelete(root, dirsToIgnore, bypassChecks, (err, data) => {
  if (err) { throw err; }

  console.log(`
  root directory: ${root}
  directories removed:
    ${data.join('\n')}
  `);
});

app.findPrintDelete.bind(app);

module.exports = { app, dirsToIgnore };