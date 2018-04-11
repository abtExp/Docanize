#!/usr/bin/env node

const Entities = require('./src/Entities');
const makeDirTree = require('./src/makeDirTree');
const generateComments = require('./src/generateComments');
const fs = require('fs');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const argv = require('yargs')
.usage('Usage: $0 <command> [options]')
.command('docanize', 'generate jsdoc style comments for js and ts files')
.example('$0 docanize [options]', 'generates the docs for all files with the root as dir or current working directory')
.alias('d', 'dir')
.alias('l','linspace')
.describe('dir', 'specify the root directory for files for which the comments are to be generated.')
.describe('linspace', 'specify the spacing between lines of comments(defaults to 1)')
.help('h')
.alias('h', 'help')
.epilog('copyright 2018')
.argv;

(async()=>{
    const ROOT = argv.dir ? path.resolve(process.cwd(),argv.dir) : process.cwd();
    let [dirTree, AllFiles] = await makeDirTree(ROOT);
    console.log('Writing tree.json...');
    await writeFile(path.resolve(ROOT,'./tree.json'), JSON.stringify(dirTree, null, 4));
    console.log('Created tree.json');
    await generateComments(ROOT,AllFiles,argv.linspace);
    console.log('Generated Comments!');
})();