
import fs from 'fs';
import path from 'path';

import fse from 'fs-extra';

export default class BuildToolClassTS {

  output: boolean = false;

  srcString: string = '';
  distString: string = '';
  templateString: string = '';

  srcPath: string = '';
  templatePath: string = '';
  distPath: string = '';

  templates: { [key: string]: string } = {};
  files: { [key: string]: string } = {};

  constructor(
    output: boolean = true,
    src: string = 'src',
    dist: string = 'dist',
    templates: string = 'templates'
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
  readFilenamesFromDirectory = (dirname: string): Array<string> => fs.readdirSync(dirname); 
  readFile = (to: string, filename: string): string => fs.readFileSync(path.join(to, filename), 'utf8');
  saveFile = (to: string, filename: string, contents: string) => fs.writeFileSync(path.join(to, filename), contents);
  
  templatize = (content: string, templates: any, matchFn: any): string => {
    for (let key in templates) {
      const match = matchFn(key);
      content = content.replace(match, templates[key]);
    }
    return content;
  };

  clearDistributionDirectory = (path: string): void => {
    this.output && console.log(`Processing ${ path } Directory`);
    if (fs.existsSync(path)) {
      fs.rmSync(path, { recursive: true });
    }
    fs.mkdirSync(path);
  };

  getAndReadFiles = (path: string, pattern: string = ''): { [key: string]: string } => {
    let result: { [key: string]: string } = {};
    const files: Array<string> = this.readFilenamesFromDirectory(path);
    files.forEach(file => {
      if ((pattern.length === 0) || (file.substring(file.length - pattern.length) === pattern)) {
        result[file] = this.readFile(path, file);
        this.output && console.log(`Reading File: ${ file }`);
      }
    });
    return result;
  };

  copyStaticFiles = (title: string, folder: string): void => {
    this.output && console.log(`Copying ${ title } Files`);
    const from: string = path.join(this.srcPath, folder);
    const to: string = path.join(this.distPath, folder);
    fse.copySync(from, to, { overwrite: true }, (error) => {
      if (error) {
        throw error;
      } else {
        this.output && console.log(`Moved ${ title } Files`);
      }
    });
  };
    
  process = (): void => {  
    console.log('done.');
  };
  
}
