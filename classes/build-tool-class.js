
import fs from 'fs';
import path from 'path';

import fse from 'fs-extra';

export default class BuildToolClass {

  output = false;

  srcString = '';
  distString = '';
  templateString = '';

  srcPath = '';
  templatePath = '';
  distPath = '';

  templates = {};
  files = {};

  constructor(
    output = true,
    src = 'src',
    dist = 'dist',
    templates = 'templates'
  ) {
    this.output = output;
    this.srcString = src;
    this.distString = dist;
    this.templateString = templates;

    this.srcPath = path.resolve(this.srcString);
    this.templatePath = path.join(this.srcPath, this.templateString);
    this.distPath = path.resolve(this.distString);
  }

  // Internal Functionality
  readFilenamesFromDirectory = (dirname) => fs.readdirSync(dirname); 
  readFile = (to, filename) => fs.readFileSync(path.join(to, filename), 'utf8');
  saveFile = (to, filename, contents) => fs.writeFileSync(path.join(to, filename), contents);
  
  templatize = (content, templates, matchFn) => {
    for (let key in templates) {
      const match = matchFn(key);
      content = content.replace(match, templates[key]);
    }
    return content;
  };

  clearDistributionDirectory = (path) => {
    this.output && console.log(`Processing ${ path } Directory`);
    if (fs.existsSync(path)) {
      fs.rmSync(path, { recursive: true });
    }
    fs.mkdirSync(path);
  };

  getAndReadFiles = (path, pattern = '') => {
    let result = {};
    const files = this.readFilenamesFromDirectory(path);
    files.forEach(file => {
      if ((pattern.length === 0) || (file.substring(file.length - pattern.length) === pattern)) {
        result[file] = this.readFile(path, file);
        this.output && console.log(`Reading File: ${ file }`);
      }
    });
    return result;
  };

  copyStaticFiles = (title, folder) => {
    this.output && console.log(`Copying ${ title } Files`);
    const from = path.join(this.srcPath, folder);
    const to = path.join(this.distPath, folder);
    fse.copySync(from, to, { overwrite: true }, (error) => {
      if (error) {
        throw error;
      } else {
        this.output && console.log(`Moved ${ title } Files`);
      }
    });
  };
    
  process = () => {  
    console.log('done.');
  };
  
}
