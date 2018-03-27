const { Entity, SubEntity } = require('./Entities');
const { checkLineForEntity, captureParams } = require('./utilities');
const FLAGS_DEF = require('./FLAGS');
let FLAGS = new FLAGS_DEF();

module.exports = function(line, lineNumber) {
    //match the entityTypes and create a new entity object
    //then look for subEntities and their dTypes
    let props = {};
    props.lineNumber = lineNumber;
    if (FLAGS.KEEP_SCOPE) {
        FLAGS = new FLAGS_DEF();
        FLAGS.CLASS_SCOPE = true;
    } else if (FLAGS.NEW_FLAGS) FLAGS = new FLAGS_DEF();

    // Check for any previous doc comments
    if (line.indexOf('//') > -1 || line.indexOf('/*') > -1)
        FLAGS.COMMENT_ON = true;

    if (FLAGS.COMMENT_ON && line.match(/@.*/)) {
        FLAGS.PREVIOUS_COMMENT = true;
        FLAGS.PREVIOUS_COMMENT_START = lineNumber;
    }

    if (FLAGS.PREVIOUS_COMMENT && !FLAGS.PREVIOUS_COMMENT_END) {
        if (line.indexOf('*/') > -1) {
            FLAGS.PREVIOUS_COMMENT_END = lineNumber;
            FLAGS.COMMENT_ON = false;
        }
    }

    // check for docanize comments
    if (line.match(/^[(\/)|\/\*\* ].*@docanize/)) {
        FLAGS.COMMENT_ON = true;
        FLAGS.PREVIOUS_COMMENT = true;
        FLAGS.PREVIOUS_COMMENT_START = lineNumber;
        if (line.indexOf('//') === 0)
            FLAGS.SINGLE_LINE_DESCRIPTION = true;
        else if (line.indexOf('/*') === 0)
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
        FLAGS.COMMENT_ON = false;
        FLAGS.PREVIOUS_COMMENT_END = lineNumber;
    }

    // for multiline docanize comment
    if (FLAGS.MULTI_LINE_DESCRIPTION) {
        if (!FLAGS.DOCANIZE_FLAG_CAPTURED) {
            if (line.match('--')) {
                props.docanizeFlag = line.substring(
                    line.indexOf('--' + 2), line.indexOf(':')
                ).trim();
            } else return null;
        }
        if (!FLAGS.USER_DESCRIPTION_CAPTURED) {
            props[props.docanizeFlag] += line;
        }
    }
    if (line.match(/\*\//) && !FLAGS.USER_DESCRIPTION_CAPTURED) {
        props[props.docanizeFlag] += line.substring(0, line.lastIndexOf('*'));
        FLAGS.USER_DESCRIPTION_CAPTURED = true;
        FLAGS.COMMENT_ON = false;
        FLAGS.PREVIOUS_COMMENT_END = lineNumber;
    }

    // OTHER CHECKS

    // if no entity is open
    if (!FLAGS.ENTITY_OPEN) {
        let [containsEntity, entityType, entityName] =
        checkLineForEntity(line);
        if (containsEntity) {
            FLAGS.ENTITY_OPEN = true;
            FLAGS.NEW_FLAGS = false;
            if (entityType === 'funcOrMeth') {
                if (FLAGS.CLASS_SCOPE) {
                    FLAGS.METHOD_SCOPE = true;
                    entityType = 'method';
                } else {
                    entityType = 'function';
                    FLAGS.ANONYMOUS_FUNCTION_DEF = true;
                }
            }
            if (entityType === 'function' || entityType === 'method' || entityType === 'constructor')
                FLAGS.CAPTURE_PARAMS = true;
            props.keyword = entityType;
            props.name = entityName;
            if (entityType === 'class') FLAGS.CLASS_SCOPE = true;
            else if (entityType === 'function') FLAGS.FUNCTION_SCOPE = true;
            else if (entityType === 'constructor') FLAGS.CLASS_CONSTRUCTOR_DEF = true;
            if (FLAGS.CLASS_SCOPE) {
                FLAGS.KEEP_SCOPE = true;
                if (line.match(/extends/)) {
                    FLAGS.EXTENDS.super = line.substring(line.indexOf('extends') +
                        'extends'.length + 1, (line.lastIndexOf('{') || line.length));
                }
                FLAGS.ENTITY_OPEN = false;
                FLAGS.MAKE_ENTITY = true;
            }
        } else return null;
    }

    if (FLAGS.CAPTURE_PARAMS) {
        props = captureParams(line, props, SubEntity);
        FLAGS.ENTITY_PARAMS_CAPTURED = true;
        FLAGS.ENTITY_OPEN = false;
        FLAGS.MAKE_ENTITY = true;
        FLAGS.CAPTURE_PARAMS = false;
    }

    // FINALLY
    if (FLAGS.MAKE_ENTITY) {
        props.flags = FLAGS;
        FLAGS.NEW_FLAGS = true;
        return new Entity(props);
    } else return null;
}