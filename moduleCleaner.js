const fs = require('fs');
const path = require("path");
const root = path.parse(process.cwd()).dir;
const os = require("os");

// module.exports.
// const moduleCleaner = (dir, done) => {
//   let deletedDirPaths = [];

//   fs.readdir(dir, (err, list) => {
//     if (err) { return done(err); }

//     let pending = list.length;

//     if (!pending) { return done(null, deletedDirPaths); }

//     list.forEach((file) => {
//       fileOrFolder = path.resolve(dir, fileOrFolder);

//       fs.stat(fileOrFolder, (err, stat) => {
//         // If directory, execute a recursive call
//         if (stat && stat.isDirectory()) {
//           const directories = path.dirname(fileOrFolder);
//           const directory = directories[directories.length - 1];

//           if (directory === 'node_modules') {
            
//           }

//           filewalker(fileOrFolder, (err, res) => {
//             deletedDirPaths = [deletedDirPaths, ...res];
//             //if (!--pending) { done(null, deletedDirPaths); }
//           });
//         } else {
//           deletedDirPaths.push(fileOrFolder);

//           //if (!--pending) { done(null, deletedDirPaths); }
//         }
//       });
//     });
//   });
// };

// /* fs.rmdirSync */  


function filewalker(dir, done) {
  let results = [];

  fs.readdir(dir, function(err, list) {
      if (err) return done(err);

      var pending = list.length;

      if (!pending) return done(null, results);

    list.forEach(function (file) {

        file = path.resolve(dir, file);
        
          fs.stat(file, function(err, stat){
              // If directory, execute a recursive call
              if (stat && stat.isDirectory()) {
                  // Add directory to array [comment if you need to remove the directories from the array]
                  results.push(file);

                  filewalker(file, function(err, res){
                      results = results.concat(res);
                      //if (!--pending) done(null, results);
                  });
              } else {
                  results.push(file);
                pending--;
                console.log(pending, file)
                  if (!pending) done(null, results);
              }
          });
    });
    
    //done(null, results)
  });
};
console.log(filewalker('/Users/Adubya/Desktop/CODE/Fullstack/Projects/senior-enrichment/', (err, data) => {
  if (err) { throw err }

  console.log(data)
}))

console.log(path.parse(process.cwd()).dir)