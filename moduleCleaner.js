const fs = require('fs');
const path = require('path');
const root = path.parse(process.cwd()).dir;
const thisDir = path.resolve(path.parse(process.cwd()).dir, path.parse(process.cwd()).base);
// const os = require("os");

// module.exports.
const moduleCleaner = (dir, done) => {
  let deletedDirPaths = [];

  fs.readdir(dir, (err, list) => {
    console.log(list)
    if (err) { return done(err); }

    let pending = list.length;

    if (!pending) { return done(null, deletedDirPaths); }

    for (let i = 0; i < list.length; i++) {

      const fileOrFolder = list[i];
      const fileOrFolderPath = path.resolve(dir, fileOrFolder);

      fs.stat(fileOrFolderPath, (err, stat) => {
        if (stat && stat.isDirectory()) {

          if (fileOrFolder === 'node_modules') {  // If node_modules dir, remove dir
            deletedDirPaths = [...deletedDirPaths, fileOrFolderPath];

            // /* fs.rmdir(directory, (err) => { console.err(err) }) */  
            pending--;
            done(null, deletedDirPaths)
            
            if (!pending) { done(null, deletedDirPaths); }
            
            
          } else if (fileOrFolder[0] != '.') { // If dir is not hidden, execute a recursive call
            
            moduleCleaner(fileOrFolderPath, (err, res) => {
              if (res.length) {
                deletedDirPaths = deletedDirPaths.concat(res);
                console.log(deletedDirPaths)
              }
              pending--;
              if (!pending) { done(null, deletedDirPaths); }
            });

          }

        } else {
          pending--;
          if (!pending) { done(null, deletedDirPaths); }
        }
      });

    }


  });

};



// function filewalker(dir, done) {
//   let results = [];

//   fs.readdir(dir, (err, list) => {
//     if (err) return done(err);

//     let pending = list.length;

//     if (!pending) return done(null, results);

//     list.forEach( (file) => {
//       file = path.resolve(dir, file);

//       fs.stat(file,  (err, stat) => {
//         // If directory, execute a recursive call
//         if (stat && stat.isDirectory()) {
//           // Add directory to array [comment if you need to remove the directories from the array]
//           results.push(file);

//           filewalker(file, (err, res) => {
//             results = results.concat(res);
//             if (!--pending) done(null, results);
//           });
//         } else {
//           results.push(file);
//           pending--;
//           if (!pending) done(null, results);
//         }
//       });
//     });

//   });
// }


moduleCleaner(thisDir, (err, data) => {
  if (err) { throw err; }

  console.log('final view--->', data);
});