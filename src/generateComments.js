const findEntities = require('./findEntities'),
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    { updateFileData } = require('./utilities');

const readFile = util.promisify(fs.readFile);

const ROOT = process.cwd();

/**
 * @function generateComments - Generates JSDoc style comments and places 
 *                              them at the specified position
 * 
 * @param {Array} files - the array of all files  
 * 
 * @returns {Array} of strings of file names of all the imports 
 * 
 */

module.exports = function generateComments(files) {
    console.log('Generating Comments ...');
    let promiseList = [],
        ext = '',
        entities = [];

    for (let i of Object.values(files)) {
        ext = i.name.slice(i.name.lastIndexOf('.') + 1);
        files[i.id].extension = ext;
        if (ext.match(/js|ts/)) {
            promiseList.push(new Promise(async(res, rej) => {
                readFile(path.resolve(ROOT, i.path), 'utf8')
                    .then(async(data) => {
                        let lineNumber = 0;
                        entityObjects = data.split('\n').map(i => {
                            lineNumber++;
                            let entity;
                            return findEntities(i, lineNumber);
                        }).filter(i => i !== null);
                        await updateFileData(entityObjects, data, i.path);
                        res();
                    })
                    .catch(err => {
                        console.error(err);
                        rej();
                    })
            }));
        }
    }
    return Promise.all(promiseList);
}