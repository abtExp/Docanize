#!/usr/bin/env node

const Entities = require('./src/Entities');
const makeDirTree = require('./src/makeDirTree');
const generateComments = require('./src/generateComments');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

(async() => {
    let [dirTree, AllFiles] = await makeDirTree();
    console.log('Writing tree.json...');
    await writeFile('tree.json', JSON.stringify(dirTree, null, 4));
    console.log('Created tree.json');
    await generateComments(AllFiles);
    console.log('Generated Comments!');
})();