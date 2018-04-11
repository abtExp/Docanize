#!/usr/bin/env node

const Entities = require('./src/Entities');
const makeDirTree = require('./src/makeDirTree');
const generateComments = require('./src/generateComments');
const fs = require('fs');
const path = require('path');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const argv = require('yargs').argv;

let ROOT = path.resolve(process.cwd(),argv.dir);
(async()=>{
    ROOT = ROOT || process.cwd();
    let [dirTree, AllFiles] = await makeDirTree(ROOT);
    console.log('Writing tree.json...');
    await writeFile(path.resolve(ROOT,'./tree.json'), JSON.stringify(dirTree, null, 4));
    console.log('Created tree.json');
    await generateComments(ROOT,AllFiles);
    console.log('Generated Comments!');
})();