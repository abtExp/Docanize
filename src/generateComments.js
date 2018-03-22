const findEntities = require('./findEntities'),
    path = require('path'),
    { updateFileData } = require('./utilities');


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
    let promiseList = [],
        matchN = false,
        ext = '',
        entities = [];

    for (let i of Object.values(files)) {
        ext = i.name.slice(i.name.lastIndexOf('.') + 1);
        files[i.id].extension = ext;
        if (ext.match(/js|ts/)) {
            promiseList.push(new Promise(async(res, rej) => {
                readFile(path.resolve(__dirname, i.path), 'utf8')
                    .then(async(data) => {
                        let lineNumber = 0;
                        // match entity names
                        // if found read the whole line for params
                        // and find a way for finding the return value
                        entityObjects = data.split('\n').map(i => {
                            lineNumber++;
                            return findEntities(i, lineNumber);
                        }).filter(i => i !== null);
                        await updateFileData(entityObjects, data, i.path);
                        res();
                    })
                    .catch(err => {
                        console.error(err);
                        rej();
                    })
                res();
            }));
        }
    }
    return Promise.all(promiseList);
}