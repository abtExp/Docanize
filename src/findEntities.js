const { Entity, SubEntity } = require('./Entities');
const { checkLineForEntity, captureParams } = require('./utilities');

module.exports = function(line, lineNumber, FLAGS) {
    //match the entityTypes and create a new entity object
    //then look for subEntities and their dTypes
    let props = {};
    props.lineNumber = lineNumber;
    if (FLAGS.KEEP_SCOPE) {
        FLAGS = require('./FLAGS');
        FLAGS.CLASS_SCOPE = true;
    } else if (FLAGS.NEW_FLAGS) FLAGS = require('./FLAGS');


    //*1. Checking for @docanize specific comments
    if (line.match(/^[(\/)|\/\*\* ].*@docanize/)) {
        if (line.indexOf('//') === 0)
            FLAGS.SINGLE_LINE_DESCRIPTION = true;
        else if (line.indexOf('/*') === 0)
            FLAGS.MULTI_LINE_DESCRIPTION = true;

        FLAGS.GIVEN_DEF = true;
    }

    // if docanize comment found and is a sigle line comment
    // find the flag and the description of entity
    if (FLAGS.SINGLE_LINE_DESCRIPTION) {
        props.docanizeFlag = line.substring(
            line.indexOf('--' + 2), line.indexOf(':')
        ).trim();
        FLAGS.DOCANIZE_FLAG_CAPTURED = true;
        props[props.docanizeFlag] = line.substring(line.indexOf(':') + 1);
        FLAGS.USER_DESCRIPTION_CAPTURED = true;
    }

    // for multiline docanize comment
    if (FLAGS.MULTI_LINE_DESCRIPTION) {
        if (!FLAGS.DOCANIZE_FLAG_CAPTURED) {
            if (line.match('--')) {
                props.docanizeFlag = line.substring(
                    line.indexOf('--' + 2), line.indexOf(':')
                ).trim();
            } else return [FLAGS, null];
        }
        if (!FLAGS.USER_DESCRIPTION_CAPTURED) {
            props[props.docanizeFlag] += line;
        }
    }
    if (line.match(/\*\//) && !FLAGS.USER_DESCRIPTION_CAPTURED) {
        props[props.docanizeFlag] += line.substring(0, line.lastIndexOf('*'));
        FLAGS.USER_DESCRIPTION_CAPTURED = true;
    }

    // OTHER CHECKS

    // if no entity is open
    if (!FLAGS.ENTITY_OPEN) {
        const [containsEntity, entityType, entityName] = checkLineForEntity(line);
        if (containsEntity) {
            FLAGS.ENTITY_OPEN = true;
            FLAGS.NEW_FLAGS = false;
            if (FLAGS.CLASS_SCOPE && entityType === 'funcOrMeth') {
                FLAGS.METHOD_SCOPE = true;
                entityType = 'method';
            }
            props.keyword = entityType;
            props.name = entityName;
            if (entityType === 'class') FLAGS.CLASS_SCOPE = true;
            else if (entityType === 'function') FLAGS.FUNCTION_SCOPE = true;
            if (FLAGS.CLASS_SCOPE) {
                FLAGS.KEEP_SCOPE = true;
                if (line.match(/extends/)) {
                    FLAGS.EXTENDS.super = line.substring(line.indexOf('extends') +
                        'extends'.length + 1, (line.lastIndexOf('{') || line.length));
                }
                FLAGS.ENTITY_OPEN = false;
                FLAGS.MAKE_ENTITY = true;
            }
        } else return [FLAGS, null];
    }

    if (FLAGS.ENTITY_OPEN) {
        captureParams(line, props, SubEntity);
        FLAGS.ENTITY_PARAMS_CAPTURED = true;
        FLAGS.ENTITY_OPEN = false;
        FLAGS.MAKE_ENTITY = true;
    }

    // FINALLY
    if (FLAGS.MAKE_ENTITY) {
        props.flags = FLAGS;
        FLAGS.CLASS_SCOPE = false;
        FLAGS.NEW_FLAGS = true;
        return [FLAGS, new Entity(props)];
    } else return [FLAGS, null];
}