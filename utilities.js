const fs = require('fs'),
    util = require('util'),
    markRefLinks = require('./markRefLinks'),
    readFile = util.promisify(fs.readFile),
    writeFile = util.promisify(fs.writeFile),
    Entities = require('./Entities');

/**
 * @function editLinks - edits the reference links
 * 
 * @param {String} data 
 * @param {String} newPath 
 * @param {String} oldPath
 * 
 * @returns {String} edited file  
 */

function editLinks(data, newPath, oldPath) {
    let newData = data;
    newData = newData.split(oldPath).join(newPath);
    return newData;
}

/**
 * @function updateFileData - edits the file and writes the 
 *                            new data to the file.
 * 
 * @param {String} filePath 
 * @param {String} newRelPath 
 * @param {String} oldRelPath 
 * @param {String} data 
 * 
 * @returns {Promise}
 * 
 */

function updateFileData(filePath, newRelPath, oldRelPath, data) {
    return new Promise(async(res, rej) => {
        let file = editLinks(data, newRelPath, oldRelPath);
        try {
            await writeFile(filePath, file);
            res();
        } catch (err) {
            rej();
        }
    })
}

function formEntities(line, lineNumber) {
    // extract info from the passed in line.
    // read line and if encountered 'function' or 'class'
    // turn the flag on and read the param list and if ext = ts read 
    // the types as well else set types to any

}

module.exports = {
    editLinks,
    formEntities,
    updateFileData
}