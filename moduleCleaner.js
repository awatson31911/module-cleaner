const fs = require('fs');
const path = require('path');
const root = path.parse(process.cwd()).dir;
const thisDir = path.parse(process.cwd()).dir;
// const os = require("os");

// module.exports.
const moduleCleaner = (dir, done) => {
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
        //console.log(fileOrFolder, fileOrFolderPath)
        if (stat && stat.isDirectory()) {
          if (fileOrFolder === 'node_modules') {  // If node_modules dir, remove dir
            deletedDirPaths = [...deletedDirPaths, fileOrFolderPath];
            
            fs.rmdir(fileOrFolderPath, (err) => { console.error(err) })
            
            pending--;
            if (!pending) {
              done(null, deletedDirPaths);
            }
            
          } else if (fileOrFolder[0] != '.') { // If dir is not hidden, execute a recursive call
            
            moduleCleaner(fileOrFolderPath, (err, res) => {
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

moduleCleaner('/Users/Adubya/Desktop/CODE/Fullstack/Projects/Personal-Site', (err, data) => {
  if (err) { throw err;  }

  console.log('final view--->', data);
});

