const fs = require('fs'),
    util = require('util'),
    path = require('path'),
    writeFile = util.promisify(fs.writeFile),
    { Entity } = require('./Entities'),
    commentTemplate = require('./commentTemplate');

/**
 * @function editData - edits the file data injecting the comment
 * 
 * @param {String} entity 
 * @param {String} data 
 * 
 * @returns {String} edited file  
 */

function editData(entity, data) {
    const lineNumber = entity.lineNumber;
    let comment = entity.formComment();
    data = data.split('\n');
    comment = comment.split('\n');
    data = data.slice(0, lineNumber - 1)
        .concat(comment)
        .concat(data.slice(lineNumber - 1))
        .join('\n');
    return data;
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

function updateFileData(entities, data, filePath) {
    return new Promise(async(res, rej) => {
        data = entities.map(i => editData(i, data));
        try {
            await writeFile(path.resolve(process.cwd(), filePath), data);
            res();
        } catch (err) {
            rej();
        }
    })
}

/**
 * @function checkLineForEntity - Scans The Line for class or function
 *                                instance
 * 
 * @param {String} line - The line of code
 * 
 * @returns {Array} - [
 *                      containsEntity {boolean} - whether the line contains
 *                                                 an entity
 *                    , entity {String} - The Entity Type
 *                    , name {String} - The Name of the entity
 *                  ]
 * 
 */
function checkLineForEntity(line) {
    let containsEntity, entity, name;
    const capture = /(?:(class|function)).*(\(|\{)/gm.exec(line);
    if (capture) {
        containsEntity = true;
        entity = capture[1];
        if (!entity) entity = line.match(/(?:(\(.*)\))/) ? 'funcOrMeth' : null;
    }
    if (entity) {
        let possibleNames = line.split(' ').filter(i => !i.match(
            /class|function|export|extends|default|=|:|\n|\r|const|let|var/
        ));
        name = possibleNames[0];
    }
    return [containsEntity, entity, name];
}


/**
 * @function captureParams - Captures the parameters from a line
 * @param {String} line
 * @param {Object} props 
 * @param {Class} SubEntity 
 */
function captureParams(line, props, SubEntity) {
    let subEntities = [],
        typeDefs = [];
    if (line.match(/.*\(.*\).*/)) {
        subEntities = line.substring(
            line.indexOf('('), line.lastIndexOf(')')
        ).split(',');
        typeDefs = props.docanizeFlag === 'type' ?
            props[props.docanizeFlag] : subEntities.some(i => {
                i.indexOf(':') > -1;
            }) ? subEntities.map(i => i.substring(i.indexOf(':' + 1))) : [];
    }
    props.subEntities = [];
    for (let i = 0; i < subEntities.length; i++) {
        props.subEntities.push(new SubEntity({
            keyword: 'param',
            type: typeDefs[i] ? typeDefs[i] : ['any'],
            name: subEntities[i],
        }))
    }
}

module.exports = {
    editData,
    checkLineForEntity,
    updateFileData,
    captureParams
}