
import BuildToolClassTS from './classes/build-tool-class-ts';

class BuildTool extends BuildToolClassTS {

  // Implementation Tasks
  getTemplates = (): void => {
    this.templates = this.getAndReadFiles(this.templatePath, '.template.html');
  };

  getHTMLFiles = (): void => {
    this.files = this.getAndReadFiles(this.srcPath, '.html');
  };

  processHTMLFiles = (): void => {
    const template = (key: string) => `<!-- TEMPLATE: ${ key } -->`;

    for (let key in this.files) {
      this.output && console.log(`Processing File: ${ key } (template)`);
      const contents: string = this.templatize(this.files[key], this.templates, template);
      this.saveFile(this.distPath, key, contents);
    }
  };
  
  process = () => {  
    this.clearDistributionDirectory(this.distPath);

    this.getTemplates();
    this.getHTMLFiles();
    this.processHTMLFiles();

    this.copyStaticFiles('JS', 'js');
    this.copyStaticFiles('CSS', 'styles');
    this.copyStaticFiles('Assets', 'assets');
  
    this.output && console.log('done.');
  };
  
}

const buildTool = new BuildTool();
buildTool.process();
