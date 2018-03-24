const fs = require('fs'),
    util = require('util'),
    writeFile = util.promisify(fs.writeFile),
    { Entity } = require('./Entities'),
    commentTemplate = require('./commentTemplate');

/**
 * @function editData - edits the file data injecting the comment
 * 
 * @param {String} comment 
 * @param {String} data 
 * 
 * @returns {String} edited file  
 */

function editData(entity, data) {
    const lineNumber = entity.lineNumber;
    let comment = entity.formComment();
    data = data.split('\n');
    comment = comment.split('\n');
    data.slice(0, lineNumber)
        .concat(comment)
        .concat(data.slice(lineNumber + comment.length + 1));
}

/**
 * @function updateFileData - edits the file and writes the 
 *                            new data to the file.
 * 
 * @param {String} path - the path of the file to be written
 * @param {String} data - the file data 
 * @param {Array} comments - the comments to be injected  
 * 
 * @returns {Promise}
 * 
 */

function updateFileData(entities, data, path) {
    return new Promise(async(res, rej) => {
        entities.map(i => editData(i, data));
        try {
            await writeFile(path.resolve(process.cwd(), path), data);
            res();
        } catch (err) {
            rej();
        }
    })
}

function checkLineForEntity(line) {
    let containsEntity, entity, name;
    if (line.match(/(?:(class|function)).*(\(|\{)/gm))
        containsEntity = true;

    entity = line.indexOf('class') > -1 ? 'class' :
        line.indexOf('function') > -1 ? 'function' :
        line.match(/(?:(\(.*)\))/) ? 'funcOrMeth' : null;

    if (entity) {
        line = line.split();
        name = line[];
    }
    return [containsEntity, entity, name];
}

module.exports = {
    editData,
    checkLineForEntity,
    updateFileData
}