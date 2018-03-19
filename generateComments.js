const findEntities = require('./findEntities'),
    { findExactPath } = require('./util');


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
        ext = '';

    for (let i of Object.values(files)) {
        ext = i.name.slice(i.name.lastIndexOf('.') + 1);
        files[i.id].extension = ext;
        promiseList.push(new Promise(async(res, rej) => {
            let entities = await findEntities(i.path, ext);

            res();
        }));
    }
    return Promise.all(promiseList);
}