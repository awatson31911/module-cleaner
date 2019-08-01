const fs = require('fs');
const path = require("path");
const root = path.parse(process.cwd()).dir;
// const os = require("os");

// module.exports.
const moduleCleaner = (dir, done) => {
  let deletedDirPaths = [];

  fs.readdir(dir, (err, list) => {
    console.log(list)
    if (err) { return done(err); }

    let pending = list.length;

    if (!pending) { return done(null, deletedDirPaths); }

    list.forEach( (fileOrFolder) => {
      fileOrFolderPath = path.resolve(dir, fileOrFolder);
      
      fs.stat(fileOrFolderPath, (err, stat) => {
        if (stat && stat.isDirectory()) {
          
          // If node_modules dir, remove dir
          if (directory === 'node_modules') {
            deletedDirPaths.push(fileOrFolderPath)
            // /* fs.rmdir(directory, (err) => { console.err(err) }) */  
            
          }
          
          // If dir is not hidden, execute a recursive call
          if (directory[0] != '.') {
            
            moduleCleaner(fileOrFolder, (err, res) => {
              deletedDirPaths = [deletedDirPaths, ...res];
          
              pending--;
              if (!pending) { done(null, deletedDirPaths); }
            });

          }

        } else {
          pending--;
          if (!pending) { done(null, deletedDirPaths); }
        }

      });

    });

  });

};



// function filewalker(dir, done) {
//   let results = [];

//   fs.readdir(dir, function(err, list) {
//       if (err) return done(err);

//       var pending = list.length;

//       if (!pending) return done(null, results);

//     list.forEach(function (file) {
//       //file = path.resolve(dir, file);
      
//       fs.stat(file, function(err, stat){
//         console.log(file)
//               // If directory, execute a recursive call
//               if (stat && stat.isDirectory()) {
//                   // Add directory to array [comment if you need to remove the directories from the array]
//                   results.push(file);

//                   filewalker(file, function(err, res){
//                       results = results.concat(res);
//                       //if (!--pending) done(null, results);
//                   });
//               } else {
//                   results.push(file);
//                 pending--;
//                   if (!pending) done(null, results);
//               }
//           });
//     });
    
//     //done(null, results)
//   });
// };


console.log(moduleCleaner(root, (err, data) => {
  if (err) { throw err }

  console.log(root, data)
}))

console.log(path.parse(process.cwd()).dir)