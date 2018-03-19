export default [];
export default class Entity {
    constructor(entity) {
        this.keyword = entity;
        this.scopeOn = true;
    }
}

export default class SubEntity {
    constructor(entity, type) {
        this.keyword = entity;
        this.dtype = type;
    }
}

/**
 * Supported Entities :
 * 
 * @argument
 * @author
 * @class
 * @constant
 * @constructor
 * @default
 * @event
 * @extends
 * @function
 * @method
 * @namespace
 * @param
 * @private
 * @property
 * @public
 * @requires
 * @returns
 * @static
 * @throws
 * @type
 * @typedef
 * @version
 */