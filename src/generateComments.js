const findEntities = require('./findEntities'),
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    FLAGS_DEF = require('./FLAGS'),
    { updateFileData } = require('./utilities');

const readFile = util.promisify(fs.readFile);

/**
 * @function generateComments - Generates JSDoc style comments and places 
 *                              them at the specified position
 * 
 * @param {Array} files - the array of all files  
 * 
 */

module.exports = function generateComments(ROOT,files, linspace) {
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
                        let FLAGS = new FLAGS_DEF(linspace);
                        let props = {};
                        let lineNumber = 0;
                        entityObjects = data.split('\n').map(i => {
                            lineNumber++;
                            let entity;
                            [entity, FLAGS, props] = findEntities(i, lineNumber, FLAGS, props);
                            return entity;
                        }).filter(i => i !== null);
                        await updateFileData(ROOT, entityObjects, data, i.path);
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