const fs = require('fs'),
    path = require('path'),
    util = require('util'),
    { formEntities } = require('./utilities'),
    readFile = util.promisify(fs.readFile);


module.exports = function(dirpath, ext) {
    let entityObjects = [];
    if (ext.match(/js|ts/)) {
        return new Promise((res, rej) => {
            readFile(path.resolve(dirpath), 'utf8')
                .then(data => {
                    let lineCount = 0;
                    // match entity names
                    // if found read the whole line for params
                    // and find a way for finding the return value
                    entityObjects = data.split('\n').map(i => {
                        lineCount++;
                        return formEntities(i, lineCount);
                    });
                    res(entityObjects);
                })
                .catch(err => {
                    console.error(err);
                    rej();
                })
        })
    }
}