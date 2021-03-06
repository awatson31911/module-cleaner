# module-cleaner
A CLI application to delete unused node modules

## Installation
```node
npm install -g module-cleaner
```

## Usage
Takes a projects directory and looks for any node_module folders contained inside of it. Once found, the folder and all contents are deleted using the fs-extra package's remove() method. Optionally, can flag project directories to ignore.

#### Default ignored folders:
   - Any hidden files i.e. ".gitignore" ".nvm"
   - macOS - usr, System, System Volume Information, Applications, Application Support
   - Windows - Windows,  AppData, Application Data, Cookies, Program Files, Program Files(x86), 		Local Settings, Documents and Settings

*** Install Globally to avoid deleting this package with other node_modules ***

#### Example
Directory structure:
 *  Projects/
    * Project-1/
      * index.js
      * package.json
      * package-lock.json
      * node_modules
    * Project-2/
      * index.js
      * package.json
      * package-lock.json
      * node_modules
    * Project-3/
      * index.js
      * package.json
      * package-lock.json
      * node_modules

```node
npm install -g module-cleaner
cleanmodules -r ~/Desktop/Projects -- Project-3 
```

Directory structure:
.
 *  Projects/
    * Project-1/
      * index.js
      * package.json
      * package-lock.json
    * Project-2/
      * index.js
      * package.json
      * package-lock.json
    * Project-3/
      * index.js
      * package.json
      * package-lock.json
      * node_modules

### Flags
- -c - Include current directory in directories to delete. Current directory's node_modules get bypassed by default
- -r - A string of the directory to start traversing from 
- -f - Bypass default behavior of getting permission before each deletion
- -- Array of strings of the directories not to delete

*** Note: -- must be placed after any other option flags ***


## Technologies/Services/Packages Used
- fs-extra
- jest
- mock-fs
- node.js
- readline-sync
- yargs


## Run Locally
1) Clone this repo
```node
git clone https://github.com/awatson31911/node-cleaner.git
```
2) Go into project directory
```node
cd module-cleaner
```
3) Install dependencies
```node
npm install
```
4) 
```node
node moduleCleaner.js -r SOME-PROJECT-DIRECTORY
```

All feedback is welcome and appreciated. Thanks!
