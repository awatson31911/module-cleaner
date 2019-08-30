const mock = require('mock-fs');
const fs = require('fs-extra');

let { dirsToIgnore } = require('../moduleCleaner');
const { app } = require('../moduleCleaner');
const cleanModules = app.findPrintDelete;

afterEach(() => mock.restore());

beforeEach(() => {
  mock({
    'projects': {
      'project1': {
        'node_modules': {
          'module1': 'some node stuff',
          'module2': 'some node stuff',
          'module3': 'some node stuff'
        },
        'index.js': 'some boilerplate',
        '.gitignore': 'some boilerplate'
      },
      'project2': {
        'node_modules': {
          'module1': 'some node stuff',
          'module2': 'some node stuff',
          'module3': 'some node stuff'
        },
        'index.js': 'some boilerplate',
        '.gitignore': 'some boilerplate'
      },
      'project3': {
        'src': {
          'file1': 'some file stuff',
          'file2': 'some file stuff',
          'file3': 'some file stuff'
        },
      },
      'node_modules': {
        'module1': 'some node stuff'
      }
    }
  });
});

describe('The module cleaner', () => {
  const root = '/Users/Adubya/Desktop/CODE/Projects/module-cleaner/projects';

  it('Removes node_module directories', done => {
    const callback = () => {
      let dirs = fs.readdirSync('projects');
      expect(dirs).toEqual(['project1', 'project2', 'project3']);

      dirs = fs.readdirSync('projects/project1');
      expect(dirs).not.toContain(['node_modules']);

      dirs = fs.readdirSync('projects/project2');
      expect(dirs).not.toContain(['node_modules']);

      done();
    };
    cleanModules(root, dirsToIgnore, true, callback);
  });

  it('Provides removed paths', done => {
    const callback = (err, data) => {
      expect(data).toEqual(['/Users/Adubya/Desktop/CODE/Projects/module-cleaner/projects/node_modules',
        '/Users/Adubya/Desktop/CODE/Projects/module-cleaner/projects/project1/node_modules',
        '/Users/Adubya/Desktop/CODE/Projects/module-cleaner/projects/project2/node_modules'
      ]);
      done();
    };
    cleanModules(root, dirsToIgnore, true, callback);
  });


  it('Ignores specified paths', done => {
    dirsToIgnore = ['project1', ...dirsToIgnore];
    
    const callback = () => {
      const dirs = fs.readdirSync('projects/project1');

      expect(dirs).toEqual(['.gitignore', 'index.js', 'node_modules']);
      done();
    };
    cleanModules(root, dirsToIgnore, true, callback);
  });
  
  it('Ignores specified paths AND still removes other node_modules', done => {
    const callback = () => {
      const dirs = fs.readdirSync('projects/project2');
      dirsToIgnore = ['project1', ...dirsToIgnore];

      expect(dirs).not.toContain(['node_modules']);
      done();
    };
    cleanModules(root, dirsToIgnore, true, callback);
  });


});