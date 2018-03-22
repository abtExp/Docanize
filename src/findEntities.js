const { entityTypes, dTypes, Entity, SubEntity } = require('./Entities');
const FLAGS = require('./FLAGS');


module.exports = function(line, lineNumber) {
    //match the entityTypes and create a new entity object
    //then look for subEntities and their dTypes
    let props = {};

    //*1. Checking for @docanize specific comments
    if (line.match(/^[(\/)|\/\*\* ].*@docanize/)) {
        if (line.indexOf('//') === 0)
            FLAGS.SINGLE_LINE_DESCRIPTION = true;
        else if (line.indexOf('/*') === 0 || line.indexOf('/**') === 0)
            FLAGS.MULTI_LINE_DESCRIPTION = true;
        FLAGS.GIVEN_DEF = true;
    }
    if (FLAGS.SINGLE_LINE_DESCRIPTION) {
        props.docanizeFlag = line.substring(
            line.indexOf('--' + 2), line.indexOf(':')
        ).trim();
        FLAGS.DOCANIZE_FLAG_CAPTURED = true;
        props[props.docanizeFlag] = line.substring(line.indexOf(':') + 1);
        FLAGS.USER_DESCRIPTION_CAPTURED = true;
    }
    if (FLAGS.MULTI_LINE_DESCRIPTION) {
        if (!FLAGS.DOCANIZE_FLAG_CAPTURED) {
            if (line.match('--')) {
                props.docanizeFlag = line.substring(
                    line.indexOf('--' + 2), line.indexOf(':')
                ).trim();
            } else return;
        }
        if (!FLAGS.USER_DESCRIPTION_CAPTURED) {
            props[props.docanizeFlag] += line;
        }
    }
    if (line.match(/\*\//) && !FLAG.USER_DESCRIPTION_CAPTURED) {
        props[props.docanizeFlag] += line.substring(0, line.lastIndexOf('*'));
        FLAG.USER_DESCRIPTION_CAPTURED = true;
    }

    // OTHER CHECKS
    // make a method to compare against all entityTypes


    // FINALLY
    if (FLAGS.MAKE_ENTITY) {
        props.flags = FLAGS;
        return new Entity(props);
    } else return null;
}