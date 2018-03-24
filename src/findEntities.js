const { entityTypes, dTypes, Entity, SubEntity } = require('./Entities');
const { checkLineForEntity } = require('./utilities');
let FLAGS = require('./FLAGS');


module.exports = function(line, lineNumber) {
    //match the entityTypes and create a new entity object
    //then look for subEntities and their dTypes
    let props = {};
    props.lineNumber = lineNumber;

    if (FLAGS.NEW_FLAGS) FLAGS = require('./FLAGS');

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
    if (!FLAGS.ENTITY_OPEN) {
        const [containsEntity, entityType, entityName] = checkLineForEntity(line);
        if (containsEntity) {
            FLAGS.ENTITY_OPEN = true;
            FLAGS.NEW_FLAGS = false;
            if (FLAGS.CLASS_SCOPE && entityType === 'funcOrMeth') {
                FLAGS.METHOD_SCOPE = true;
                entityType = 'method';
            }
            props.entity = entityType;
            props.name = entityName;
            if (entityType === 'class') FLAGS.CLASS_SCOPE = true;
            else if (entityType === 'function') FLAGS.FUNCTION_SCOPE = true;
            if (FLAGS.CLASS_SCOPE) {
                if (line.match(/extends/))
                    FLAGS.EXTENDS.super = line.substring(line.indexOf('extends') +
                        'extends'.length + 1, (line.lastIndexOf('{') || line.length));
                FLAGS.ENTITY_OPEN = false;
                FLAGS.MAKE_ENTITY = true;
            }
        }
    }

    if (FLAGS.ENTITY_OPEN) {
        if (line.match(/.*\(.*\).*/))
            props.subEntities = line.substring(
                line.indexOf('('), line.lastIndexOf(')')
            ).split(',');
        FLAGS.ENTITY_PARAMS_CAPTURED = true;

        // if(line.match/return/)
        FLAGS.ENTITY_OPEN = false;
        FLAGS.MAKE_ENTITY = true;
    }

    // FINALLY
    if (FLAGS.MAKE_ENTITY) {
        props.flags = FLAGS;
        FLAGS.NEW_FLAGS = true;
        return new Entity(props);
    } else return null;
}